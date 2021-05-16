class Message {
  username;
  message;

  constructor(user, msg) {
    this.username = user;
    this.message = msg;
  }
}
class Chat {
  left;
  right;
  current = 'right';
  messages = [];

  constructor(left, right) {
    this.left = left;
    this.right = right;
  }

  append(msg) {
    this.messages.push(msg);
    let p = document.createElement('p');
    p.classList.add("chat-message");
    p.innerHTML = `
      <span class="username">${msg.username}:</span>
      <span class="message-content">
        ${msg.message}
      </span>
    `;
    if (this.current === 'right') {
      this.right.append(p);
      if (this.right.scrollHeight > this.right.clientHeight) {
        this.current = 'left';
        p.remove();
        this.left.append(p);
      }
    } else if (this.current === 'left') {
      this.left.append(p);
    }
  }
}

let right = document.querySelector('.right.chat-page');
let left = document.querySelector('.left.chat-page');
let page = new Chat(left, right);
page.append(new Message('aaron', 'heyyyOOO'));
page.append(new Message('aaron', 'heyyyOOO'));
page.append(new Message('aaron', 'heyyyOOO'));
page.append(new Message('aaron', 'heyyyOOO'));
page.append(new Message('aaron', 'heyyyOOO'));
page.append(new Message('aaron', 'heyyyOOO'));

for (let i = 0; i<50; i++) {
  page.append(new Message('aaron', 'heyyyOOO'));
}

