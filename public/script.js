if (/room\/\d+/g.test(window.location.href)) {
  const roomId = window.location.href.match(/room\/\d+/g)[0].split('/')[1];
  const socket = io('/room');
  const chatList = $('#chat > ul');

  socket.emit('join', roomId);

  socket.on('testsocket', function(data) {
    console.log('Connected to room', data);
  });

  socket.on('message', function(data) {
    const { author, content } = data;
    const li = `
      <li>
        <span class='author'>${author}</span>
        <span class='content'>${content}</span>
      </li>
    `;

    chatList.append($(li));
  });

  // Send message
  $('#send').on('submit', (e) => {
    e.preventDefault();
    socket.emit('message', $('#message').val());
    $('#message')[0].value = '';
  });
}
