document.addEventListener('DOMContentLoaded', () => {
  const roomId = window.location.href.match(/room\/\d+/g)[0].split('/')[1];
  const socket = io('/room');
  const chatList = $('#chat > ul');

  loadMessages().then(() => socket.emit('join', roomId));

  socket.on('testsocket', function(data) {
    console.log('Connected to room', data);
  });

  socket.on('message', function(data) {
    displayMessage(data);
  });

  // Send message
  $('#send').on('submit', (e) => {
    e.preventDefault();
    socket.emit('message', $('#message').val());
    $('#message')[0].value = '';
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

  function displayUserMessage(data) {
    const { author, content } = data;
    const li = `
      <li>
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
