const username = localStorage.getItem('name');
if (!username) {
  window.location.replace('/');
  throw new Error('Username is required');
}

//Referencias HTML
const lblStatusOnline = document.querySelector('#status-online');
const lblStatusOffline = document.querySelector('#status-offline');

const userUlElement = document.querySelector('ul');

form = document.querySelector('form');
input = document.querySelector('input');
chatElement = document.querySelector('#chat');

const renderUsers = (users) => {
  userUlElement.innerHTML = '';
  users.forEach((user) => {
    const liElement = document.createElement('li');
    liElement.innerText = user.name;
    userUlElement.appendChild(liElement);
  });
};

renderMessages = (payload) => {
  const { userId, message, name } = payload;

  const divElement = document.createElement('div');
  divElement.classList.add('message');

  if (userId !== socket.id) {
    divElement.classList.add('incoming');
  }

  divElement.innerHTML = message;
  chatElement.appendChild(divElement);
  chatElement.scrollTop = chatElement.scrollHeight;
};

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const message = input.value;
  input.value = '';
  socket.emit('send-message', message);
});

// ------------------------------------

const socket = io({
  auth: {
    token: 'abc-123',
    name: username,
  },
});

socket.on('connect', () => {
  lblStatusOnline.classList.remove('hidden');
  lblStatusOffline.classList.add('hidden');
});

socket.on('disconnect', () => {
  lblStatusOnline.classList.add('hidden');

  lblStatusOffline.classList.remove('hidden');
});

socket.on('welcome-message', (data) => {
  console.log({ data });
});

socket.on('on-clients-changed', renderUsers);

socket.on('on-message', renderMessages);
