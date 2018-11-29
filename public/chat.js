document.addEventListener('DOMContentLoaded', () => {
  const roomId = window.location.href.match(/room\/\d+/g)[0].split('/')[1];
  const socket = io('/room');
  const chatList = $('#chat > ul');
  const typingManager = new TypingManager({
    onStart: () => socket.emit('startTyping'),
    onStop: () => socket.emit('stopTyping'),
  });

  let userName = '';

  loadMessages().then(() => socket.emit('join', roomId));

  // Simple trick to get userName from session
  // and store it filter typing... data
  socket.on('joined', (username) => {
    userName = username;
  });

  // Display message
  socket.on('message', function(data) {
    displayMessage(data);
  });

  // Show other's typing...
  socket.on('typing', function(data) {
    displayTyping(data.filter((name) => name !== userName).sort());
  });

  // Handle typing... feature
  $('#message').on('keyup', function(e) {
    typingManager.observe(e.target.value);
  });

  // Send message
  $('#send').on('submit', (e) => {
    e.preventDefault();
    const value = $('#message').val();
    if (value.length > 0) {
      socket.emit('message', $('#message').val());
      $('#message')[0].value = '';
    }
  });

  // Handler room leave
  $('#leaveLink').on('click', (e) => {
    socket.emit('leave', roomId);
  });

  function loadMessages() {
    return fetch('/messages', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ roomId }),
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        const { messages } = data;
        messages.forEach(displayMessage);
      })
      .catch((err) => console.log(err));
  };

  function displayMessage(data) {
    const { type } = data;
    switch (type) {
    case 'system':
      return displaySystemMessage(data);
    default:
      return displayUserMessage(data);
    };
  }

  function displayTyping(data) {
    const formSend = $('#send');
    const typing = formSend.find('.typing');
    const currentContent = typing.text() || '';

    if (data.length > 0) {
      let content = '';
      if (data.length === 1) {
        content = `${data[0]} is typing`;
      } else if (data.length <= 3) {
        content = [
          data.slice(0, data.length - 1).join(', '),
          ' and ',
          data.slice(-1),
          ' are typing',
        ].join('');
      } else {
        content = 'Several people are typing';
      }

      if (currentContent !== content) {
        typing.remove();
        $(`<span class="typing">${content}</span>`)
          .appendTo(formSend);
      }
    } else {
      typing.remove();
    }
  }

  function displayUserMessage(data) {
    const { author, content, avatar } = data;
    const li = `
      <li>
        <span class='userpic'><img src='${avatar}'></span>
        <span class='author'>${author}</span>
        <span class='content'>${content}</span>
      </li>
    `;

    chatList.append($(li));
  };

  function displaySystemMessage(data) {
    const { content } = data;
    const li = `
      <li>
        <span class='system'>${content}</span>
      </li>
    `;

    chatList.append($(li));
  };
});

class TypingManager {
  constructor(options) {
    this.options = Object.assign({}, options);
    this.currentValue = '';
    this.timers = [];
    this.createOnceStart();
  }

  clearTimers() {
    this.timers.forEach((timer) => clearInterval(timer));
    this.timers = [];
  }

  createOnceStart() {
    this.triggerStart = _.once(() => {
      this.options.onStart && this.options.onStart();
    });
  }

  observe(value) {
    this.currentValue = value;
    this.clearTimers();
    this.triggerStart();
    const timer = setInterval(() => {
      if (this.currentValue === $('#message')[0].value) {
        this.options.onStop && this.options.onStop();
        this.clearTimers();
        this.createOnceStart();
      }
    }, 1500);
    this.timers.push(timer);
  }
}

