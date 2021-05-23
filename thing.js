const alphabet='abcdefghijklmnopqrstuvwxyz'
class Message {
  username;
  message;

  constructor(user, msg) {
    this.username = user;
    this.message = msg;
  }
}

const message_template = document.createElement('template');
message_template.innerHTML = `
    <p class="chat-message fade-in">
      <span class="username"></span>:
      <span class="message-content"></span>
    </p>
`;
class Chat {
  left;
  right;
  current;
  other;
  messages = [];
  pending = [];

  constructor(left, right) {
    this.left = this.current = left;
    this.right = this.other = right;
  }

  on_message(msg) {
    this.messages.push(msg);
    if (this.pending.length) {
      this.pending.push(msg);
    } else {
      if (!this.append(msg)) {
        this.pending.push(msg);
      }
    }
  }

  append(msg) {
    let p = render_message(msg);
    this.current.append(p);
    if (this.current.scrollHeight > this.current.clientHeight) {
      p.remove();
      [this.current, this.other] = [this.other, this.current];
      clearPage(this.current).then(()=>this.printPending());
      return false;
    }
    return true;
  }

  printPending() {
    for (let i in this.pending) {
      if (!this.append(this.pending[i])) {
        this.pending.splice(0, i);
      }
    }
    this.pending.length = 0;
  }

  appendRandom() {
    this.on_message(randoMessage());
  }
}

async function clearPage(page) {
  if (!page.children.length) { return; }
  let resolve;
  let result = new Promise((r) => resolve = r);
  page.classList.add('fade-children-out');
  let handler = (event) => {
    if (event.animationName === 'fadeOutOpacity') {
      page.classList.remove('fade-children-out');
      page.textContent = '';
      page.removeEventListener('animationend', handler);
      resolve();
    }
  };
  page.addEventListener('animationend', handler);
  return result;
}

function render_message(msg) {
  let fragment = message_template.content.cloneNode(true);
  let p = fragment.querySelector('.chat-message');
  p.querySelector('.username').textContent = msg.username;
  p.querySelector('.message-content').textContent = msg.message;
  return p;
}

let right = document.querySelector('.right.chat-page');
let left = document.querySelector('.left.chat-page');
window.page = new Chat(left, right);

for (let i = 0; i<27; i++) {
  page.append(randoMessage());
}

function many(f, times, sep='') {
  let result = '' + f();
  for (let i=1; i<times; i++) {
    result += sep + f();
  }
  return result;
}

function randoNumber(lower, upper) {
  return lower + Math.floor(Math.random()*(upper-lower));
}

function randoSentence() {
  let len = randoNumber(1, 20);
  return many(randoWord, len, ' ') + '.';
}

function randoWord() {
  let len = randoNumber(3, 10);
  return many(randoLetter, len);
}

function randoLetter() {
  return alphabet[Math.floor(Math.random()*26)];
}

function randoMessage() {
  return new Message(randoWord(), randoSentence());
}
