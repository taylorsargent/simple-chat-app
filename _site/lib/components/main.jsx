import React from 'react';
import io from 'socket.io-client';

import Utils from './utils';
import Chat from './utils/chat';
import Message from './message.jsx';
import Users from './users.jsx';
import Notification from './notification.jsx';

class MainScreen extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            notifications: [],
            messages: [],
            users: [],
        };

        this.templates = {};

        Chat.init(this.socket = io());

        Promise.all([
            'message',
            'login',
            'user',
            'info-notification',
            'connect-notification',
            'disconnect-notification',
        ].map(template => Utils.getTemplate(this.socket, template)))
            .then(templates => {
                templates.map(t => this.templates[t.template] = t.fn);
                this.updateState({templates: this.templates});
            });

        this.showLogin = true;

        this.login = Chat.login;
        this.message = Chat.message;

        this.socket.on('username-validation', response => this.onLogin(response));
        this.socket.on('user-join', name => this.onUserConnect(name));
        this.socket.on('user-disconnect', name => this.onUserDisconnect(name));
        this.socket.on('message', response => this.onMessage(response));
        this.socket.on('messages', response => {
            const data = JSON.parse(response);
            Utils.saveUsers(data.users || []);
            this.updateState({ messages: data.messages });
            Utils.scrollToBottom();
        });

        this.sendMessage = this.sendMessage.bind(this);
    }

    updateState(state) {
        this.setState(Object.assign(
            {},
            this.state,
            state
        ));
    }

    onMessage(response) {
        const data = JSON.parse(response);
        this.state.messages.push(data)
        this.updateState({ messages: this.state.messages });
    }

    onLogin(response) {
        const data = JSON.parse(response);
        if (data.exists) {
            this.state.notifications.push({
                type: 'info',
                message: `The username ${data.username} is already taken.`,
            });

            return this.updateState({ notifications: this.state.notifications });
        } else {
            Utils.saveUsername(data.username);
            this.showLogin = false;
            this.socket.emit('user-join', data.username);
            this.updateState({ username: data.username });
        }
    }

    onUserConnect(name) {
        if (Utils.getUsername() === name) return;

        const users = Utils.getUsers();
        users.push(name);
        Utils.saveUsers(users);
        this.state.notifications.push({
            type: 'connect',
            message: `${name} has connected!`,
        });
        this.updateState({
            notifications: this.state.notifications,
            users: users,
        });
    }

    sendMessage(message) {
        const value = message.trim();
        if (!value) {
            const { notifications } = this.state;
            notifications.push({
                type: 'info',
                'message': 'Your message musn\'t be empty. 😱',
            });
            this.updateState({ notifications: notifications });
        } else {
            this.message(value);
            this.refs.m.value = '';
        }
    }

    onUserDisconnect(name) {
        const users = Utils.getUsers();
        users.splice(users.indexOf(name), 1);
        Utils.saveUsers(users);
        this.state.notifications.push({
            type: 'disconnect',
            message: `${name} has disconnected!`,
        });
        this.updateState({
            notifications: this.state.notifications,
            users: users,
        });
    }

    render() {
        const { messages, notifications, users } = this.state;

        return (
          <main className="chat-app">
            <button className={[ 'user-list-button', !this.showLogin ? 'show' : 'hide' ].join(' ')}>
                <span className="icon ion-navicon" />
            </button>
            <div
                className={[ 'login', this.showLogin ? 'show' : 'hide' ].join(' ')}
            >
              <form className="login-form">
                <div
                  dangerouslySetInnerHTML={{__html: this.templates.login ? this.templates.login() : '' }}
                />
                <button
                  className="login-button"
                  onClick={e => {
                      e.preventDefault();
                      const value = document.getElementById('username').value.trim();
                      if (!value) {
                          const { notifications } = this.state;
                          notifications.push({
                              type: 'info',
                              'message': 'Your username musn\'t be empty. 😱',
                          });
                          this.updateState({ notifications: notifications });
                      } else {
                          this.login(value);
                      }

                      return false;
                  }}
                  required
                >
                  Login
                </button>
              </form>
            </div>
            <div className="notification-container">
              <ul className="notifications">
              {
                notifications.map((notification, index) => {
                    setTimeout(() => {
                        notifications.splice(index, 1);
                        this.updateState({ notifications: notifications });
                    }, 2000);

                    return (
                      <Notification
                        key={index}
                        template={this.templates[`${notification.type}-notification`]}
                        {...notification}
                      />
                    );
                })
              }
              </ul>
            </div>
            <div className="user-list">
                <Users
                    users={users}
                    template={this.templates.user}
                />
            </div>
            <ul className="messages">
            {
              messages.map((message, index) => {
                  if (!this.templates.message) return null;

                  return (
                      <Message
                          key={index}
                          template={this.templates.message}
                          {...message}
                      />
                  );
              })
            }
            </ul>
            <form
                id="message-bay"
                onSubmit={e => {
                    e.preventDefault();
                    this.sendMessage(this.refs.m.value.trim());
                }}
            >
              <textarea
                className="message-container"
                ref="m"
                onKeyPress={e => {
                    if (e.charCode == 13 && e.ctrlKey) {
                        e.preventDefault();
                        this.sendMessage(e.target.value);
                    }
                }}
              />
              <button
                type="submit"
                className="message-button"
              >
                Send
              </button>
            </form>
          </main>
        );
    }
}

export default MainScreen;
