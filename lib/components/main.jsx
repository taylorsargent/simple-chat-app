import React from 'react';
import io from 'socket.io-client';

import Utils from './utils';
import Chat from './utils/chat';
import Message from './message.jsx';
import Notification from './notification.jsx';

class MainScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      notifications: [],
      messages: [],
    };

    this.templates = {};

    Chat.init(this.socket = io());

    [
      'message',
      'login',
      'user',
      'info-notification',
      'connect-notification',
      'disconnect-notification',
    ].map(template => {
      Utils.getTemplate(this.socket, template)
        .then(fn => this.templates[template] = fn);
    });

    this.login = Chat.login;
    this.message = Chat.message;

    this.socket.on('username-validation', response => this.onLogin(response));
    this.socket.on('user-join', name => this.onUserConnect(name));
    this.socket.on('user-disconnect', name => this.onUserDisconnect(name));
    this.socket.on('message', response => this.onMessage(response));
    this.socket.on('messages', response => {
      const data = JSON.parse(response);
      Utils.saveUsers(data.users || []);
      this.setState(Object.assign({}, this.state, { messages: data.messages }));
      Utils.scrollToBottom();
    });
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
    this.updateState({messages: this.state.push(data)});
  }

  onLogin(response) {
    const data = JSON.parse(response);
    if (data.exists) return this.updateState({
      notifications: this.state.notifications.push({
        type: 'info',
        message: `The username ${data.username} is already taken.`,
      }),
    })
  }

  onUserConnect(name) {
    if (Utils.getUsername() === name) return;

    const users = Utils.getUsers();
    users.push(name);
    Utils.saveUsers(users);
    this.updateState({
      notifications: this.state.notifications.push({
        type: 'connect',
        message: `${name} has connected!`,
      }),
    });
  }

  onUserDisconnect(name) {
    const users = Utils.getUsers();
    users.splice(users.indexOf(name), 1);
    Utils.saveUsers(users);
    this.updateState({
      notifications: this.state.notifications.push({
        type: 'disconnect',
        username: `${name} has disconnected!`,
      }),
    });
  }

  render() {
    const { messages, notifications } = this.state;
    // dangerouslySetInnerHTML={/*{ __html: this.templates.login() }*/}

    return (
      <main className="chat-app">
        <div className={[ 'login', this.showLogin ? 'show' : 'hide' ]
          .join(' ')}>
          <div
            className="input"
          />
          <button
            className="login-button"
            onClick={e => this.login(e.target.value)}
          >
            Login
          </button>
        </div>
        <div className="notification-container">
          <ul className="notifications">
          {
            notifications.map(notification =>
              <Notification
                template={this.templates[`${notification.type}-notification`]}
                {...notification}
              />
            )
          }
          </ul>
        </div>
        <ul className="messages">
        {
          messages.map(message =>
            <Message
              template={this.templates.message}
              {...message}
            />
          )
        }
        </ul>
        <form id="message-bay" onSubmit={() => this.message(this.refs.m.value)}>
          <textarea
            className="message-container"
            ref="m"
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
