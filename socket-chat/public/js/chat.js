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
chatContainer = document.querySelector('#chatContainer');
chatGrupalButton = document.querySelector('.chat-grupal');
chatName = document.querySelector('#chat-name');
meProfile = document.querySelector('#me-profile');
meProfile.innerHTML = `Me:${infoUser.email}`;

const showChatDiv = () => {
  const messageDivs = chatContainer.getElementsByClassName('message');
  chatContainer.style.visibility = 'hidden';
  while (messageDivs.length > 0) {
    messageDivs[0].remove();
  }

  chatContainer.style.visibility = 'visible';
};

const renderUsers = (users) => {
  console.log('users :>> ', users);
  console.log('infoUser :>> ', infoUser);

  userUlElement.innerHTML = '';
  users.forEach((user) => {
    if (user.name !== infoUser.email) {
      const liElement = document.createElement('li');
      liElement.classList.add('chat-item');
      const buttonElement = document.createElement('button');
      buttonElement.classList.add('chat-button');
      liElement.innerText = user.name;
      buttonElement.innerText = 'Send';

      buttonElement.addEventListener('click', () => {
        showChatDiv();
        getMessagePrivados({
          users: [infoUser.email, user.name],
          messageFor: user.name,
        });
        form.dataset.socket_id = user.socketId;
        form.dataset.user_email = user.name;
        chatName.innerHTML = user.name;
      });

      liElement.appendChild(buttonElement);
      userUlElement.appendChild(liElement);
    }
  });

  chatGrupalButton.addEventListener('click', () => {
    getUserMessages();
    chatName.innerHTML = 'SMBS';
    showChatDiv();
  });
};

renderMessages = (payload) => {
  const { userId, message, name, isPrivate } = payload;
  console.log('ser envio un message :>> ', payload);

  const chatSocketId = form.getAttribute('data-socket_id');
  if (chatSocketId) {
    return;
  }

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

renderMessagesPrivados = (payload) => {
  const { userId, message, name, isPrivate } = payload;
  console.log('ser envio un message :>> ', payload);

  const chatSocketId = form.getAttribute('data-socket_id');
  if (!chatSocketId && !isPrivate) {
    return;
  }

  const divElement = document.createElement('div');
  divElement.classList.add('message');

  if (infoUser.email !== payload.name) {
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

const getUserMessages = async () => {
  const response = await fetch('http://localhost:3000/users', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
  })
    .then((response) => response.json())
    .then((res) => res);

  console.log(response);

  response.forEach((user) => {
    user.chats.forEach((chat) => {
      if (!chat.isPrivate) {
        renderMessagesUser({
          id: user.id,
          message: chat.message,
          name: user.email,
        });
      }
    });
  });
  // response.chats.forEach((chat) => {
  //   if (!chat.isPrivate) {
  //     renderMessagesUser({
  //       id: response.id,
  //       message: chat.message,
  //       name: response.email,
  //     });
  //   }
  // });

  // activeUsers.forEach(async (user) => {

  //   if (response.chats.length > 0)
  // });
};

const getMessagePrivados = async (payload) => {
  const { users, messageFor } = payload;
  console.log('usersPrivate :>> ', users);

  users.forEach(async (userPriv) => {
    const response = await fetch('http://localhost:3000/users/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },

      body: JSON.stringify({
        email: userPriv,
      }),
    })
      .then((response) => response.json())
      .then((res) => res);
    console.log('userPriv :>> ', userPriv);
    console.log('response1 :>> ', response);
    response.chats.forEach((chat) => {
      console.log('chatPriv :>> ', userPriv);
      console.log('messageFor :>> ', messageFor);
      console.log('chatPrivMessages :>> ', chat);

      const { id, email } = response;

      if (
        (chat.messageFor === messageFor && chat.messageFrom === userPriv) ||
        (chat.messageFor === userPriv && chat.messageFrom === email)
      ) {
        renderMessagesUser({
          id,
          message: chat.message,
          name: email,
        });
      }
    });
  });
};

const saveMessages = async (payload) => {
  const { message, isPrivate, messageFor } = payload;
  if (isPrivate) {
    const response = await fetch('http://localhost:3000/chats', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },

      body: JSON.stringify({
        email: infoUser.email,
        message: message,
        isPrivate: true,
        messageFor,
        messageFrom: infoUser.email,
      }),
    })
      .then((response) => response.json())
      .then((res) => res);
  } else {
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
  }
};

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const message = input.value;

  input.value = '';
  const chatSocketId = form.getAttribute('data-socket_id');
  const messageFor = form.getAttribute('data-user_email');

  if (chatSocketId) {
    // console.log(socket.emit('private-message', { message, to: chatSocketId }))
    saveMessages({ isPrivate: true, message, messageFor });
    socket.emit('private-message', { message, to: chatSocketId });
    renderMessagesPrivados({
      userId: infoUser.id,
      message,
      name: infoUser.email,
      isPrivate: true,
    });
  } else {
    await saveMessages({ message });
    socket.emit('send-message', message);
  }
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

socket.on('private-message', renderMessagesPrivados);
