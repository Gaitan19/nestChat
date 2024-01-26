/* eslint-disable @typescript-eslint/no-unused-vars */
const infoUser = JSON.parse(localStorage.getItem('infoUser'));
if (!infoUser) {
  window.location.replace('/');
  throw new Error('infoUser is required');
}

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

  divElement.innerHTML = `
  <small>${name}</small>
  <p>${message}</p>
  `;
  chatElement.appendChild(divElement);
  chatElement.scrollTop = chatElement.scrollHeight;
};

renderMessagesUser = (payload) => {
  const divElement = document.createElement('div');
  divElement.classList.add('message');

  if (payload.id !== infoUser.id) {
    divElement.classList.add('incoming');
  }

  divElement.innerHTML = `
  <small>${payload.name}</small>
  <p>${payload.message}</p>
  `;
  chatElement.appendChild(divElement);
  chatElement.scrollTop = chatElement.scrollHeight;
};

function getUserMessages(users) {
  const activeUsers = [...users];
  activeUsers.forEach(async (user) => {
    const response = await fetch('http://localhost:3000/users/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },

      body: JSON.stringify({
        email: user.name,
      }),
    })
      .then((response) => response.json())
      .then((res) => res);

    if (response.chats.length > 0)
      response.chats.forEach((chat) => {
        renderMessagesUser({
          id: response.id,
          message: chat.message,
          name: response.email,
        });
      });
  });
}

window.addEventListener('load', () => {
  socket.on('on-clients-changed', getUserMessages);
});

window.removeEventListener('load', getUserMessages);

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const message = input.value;

  const response = await fetch('http://localhost:3000/chats', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },

    body: JSON.stringify({
      email: infoUser.email,
      message: message,
    }),
  })
    .then((response) => response.json())
    .then((res) => res);

  input.value = '';
  socket.emit('send-message', message);
});

// ------------------------------------

const socket = io({
  auth: {
    token: infoUser.token,
    name: infoUser.email,
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

socket.on('welcome-message', (data) => {});

socket.on('on-clients-changed', renderUsers);

socket.on('on-message', renderMessages);
