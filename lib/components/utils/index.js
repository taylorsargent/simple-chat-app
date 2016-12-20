import _ from 'lodash';
import $ from 'jquery';

export default class Utils {
  static getTemplate(socket, name) {
    socket.emit('get-template', name);

    return new Promise(resolve =>
      socket.on(`send-template-${name}`, response => {
        const data = JSON.parse(response);
        resolve({
          template: data.name,
          fn: _.template(data.template),
        });
      }));
  }

  static scrollToBottom() {
    const heights = $('#messages li')
      .toArray()
      .map(function(li) {
        return $(li).height();
      });

    if (heights.length > 0) {
      $('#messages').scrollTop(heights.reduce(function(a, b) {
        return a + b;
      }));
    }
  }

  static notify(message) {
    console.log(message);
    // let notification;
    // if (!('Notification' in window)) return alert(message);
    // if (Notification.permission === 'granted')
    //   notification = new Notification(message);
    // else if (Notification.permission !== 'denied') {
    //   Notification.requestPermission(function(permission) {
    //     if (permission === 'granted') notification = new Notification(message);
    //   });
    // }
    //
    // return notification;
  }

  static saveToSessionStorage(key, item, json) {
    sessionStorage.setItem(key, json ? JSON.stringify(item) : item);
  }

  static getFromSessionStorage(key, json) {
    const data = sessionStorage.getItem(key);
    if (json) return JSON.parse(data);

    return data;
  }

  static getUsers() {
    return this.getFromSessionStorage('codename.users', true).users;
  }

  static getUsername() {
    return this.getFromSessionStorage('codename.username', false);
  }

  static saveUsers(users) {
    this.saveToSessionStorage('codename.users', { users: users }, true);
  }

  static saveUsername(username) {
    this.saveToSessionStorage('codename.username', username, false);
  }
}
