/* eslint-disable @typescript-eslint/no-unused-vars */
const infoUser = JSON.parse(localStorage.getItem('infoUser'));
if (!infoUser) {
  window.location.replace('/');
  throw new Error('infoUser is required');
}

const lblStatusOnline = document.querySelector('#status-online');
const lblStatusOffline = document.querySelector('#status-offline');

const userUlElement = document.querySelector('ul');
const inputRoom = document.querySelector('.input-room');
const btnCreateRoom = document.querySelector('#createRoom');
const btnJoinRoom = document.querySelector('#joinRoom');
const btnOut = document.querySelector('.button-out');

const roomsList = document.querySelector('.rooms-list');

form = document.querySelector('form');
input = document.querySelector('.input-form');
chatElement = document.querySelector('#chat');
chatContainer = document.querySelector('#chatContainer');
chatGrupalButton = document.querySelector('.chat-grupal');
chatName = document.querySelector('#chat-name');
meProfile = document.querySelector('#me-profile');
meProfile.innerHTML = `Me:${infoUser.email}`;

// logic to rooms___________________________________________

// create room
btnCreateRoom.addEventListener('click', async () => {
  const roomName = inputRoom.value;
  if (roomName.length < 1) {
    return;
  }

  const rooms = await fetch('http://localhost:3000/rooms', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
  })
    .then((response) => response.json())
    .then((res) => res);

  const existRoom = rooms.filter((room) => room.roomName === roomName);
  if (existRoom.length > 0) {
    return alert('Room already exists');
  }

  const response = await fetch('http://localhost:3000/rooms', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    body: JSON.stringify({
      roomName: roomName,
    }),
  })
    .then((response) => response.json())
    .then((res) => res);

  await alert('Room created succesfully');
  inputRoom.value = '';
});

// join room
btnJoinRoom.addEventListener('click', async () => {
  const roomName = inputRoom.value;
  if (roomName.length < 1) {
    return;
  }

  socket.emit('join-room', {
    roomName,
    user: socket.id,
    email: infoUser.email,
  });

  await alert('User Joined succesfully');
  inputRoom.value = '';
});
// final of logic rooms_____________________________________

const showChatDiv = () => {
  const messageDivs = chatContainer.getElementsByClassName('message');
  chatContainer.style.visibility = 'hidden';
  while (messageDivs.length > 0) {
    messageDivs[0].remove();
  }
  btnOut.style.visibility = 'hidden';

  chatContainer.style.visibility = 'visible';
};

const getRooms = async () => {
  const rooms = await fetch('http://localhost:3000/rooms', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
  })
    .then((response) => response.json())
    .then((res) => res);

  rooms.forEach((room) => {
    const usersInRooms = room.userRooms.map((user) => user.email);
    if (usersInRooms.includes(infoUser.email)) {
      socket.emit('join-room', {
        roomName: room.roomName,
        user: socket.id,
        email: infoUser.email,
      });
    }
  });
};

window.addEventListener('load', async () => {
  await getRooms();
});

const renderRoom = async (payload) => {
  // const { room } = payload;

  const rooms = await fetch('http://localhost:3000/rooms', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
  })
    .then((response) => response.json())
    .then((res) => res);

  roomsList.innerHTML = '';

  rooms.forEach((room) => {
    const usersInRooms = room.userRooms.map((user) => user.email);
    if (usersInRooms.includes(infoUser.email)) {
      const liElement = document.createElement('li');
      liElement.classList.add('chat-item');
      const buttonElement = document.createElement('button');
      buttonElement.classList.add('chat-button');
      liElement.innerText = room.roomName;
      buttonElement.innerText = 'Send';
      buttonElement.addEventListener('click', () => {
        showChatDiv();
        btnOut.style.visibility = 'visible';
        form.dataset.room_name = room.roomName;
        chatName.innerHTML = room.roomName;
        getMessagesRoom({ id: room.id });
      });
      liElement.appendChild(buttonElement);
      roomsList.appendChild(liElement);
    }
  });
};

const renderUsers = (users) => {
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

renderMessagesRoom = async (payload) => {
  const { userId, message, name, isPrivate, isJoin, roomN } = payload;

  const roomName = form.getAttribute('data-room_name');
  if (!roomName && !isPrivate) {
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

  if (isJoin) {
    await saveMessages({
      userId: infoUser.id,
      message,
      name,
      isLeftRoom: true,
      roomName: roomN,
    });
  }
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
  let userMessages;

  const response = await fetch('http://localhost:3000/chats', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
  })
    .then((response) => response.json())
    .then((res) => res);

  userMessages = response
    .sort((a, b) => a.id - b.id)
    .filter((userMessage) => !userMessage.isPrivate);

  userMessages.forEach((chat) => {
    renderMessagesUser({
      id: chat.user.id,
      message: chat.message,
      name: chat.user.email,
    });
  });
};

const getMessagePrivados = async (payload) => {
  const { users, messageFor } = payload;

  let userMessages;

  const response = await fetch('http://localhost:3000/chats', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
  })
    .then((response) => response.json())
    .then((res) => res);

  userMessages = response
    .sort((a, b) => a.id - b.id)
    .filter((userMessage) => {
      if (
        userMessage.user.email === users[0] ||
        userMessage.user.email === users[1]
      ) {
        return userMessage;
      }
    });

  userMessages.forEach((chat) => {
    if (
      (chat.messageFor === users[0] && chat.messageFrom === users[1]) ||
      (chat.messageFor === users[1] && chat.messageFrom === users[0])
    ) {
      renderMessagesUser({
        id: chat.user.id,
        message: chat.message,
        name: chat.user.email,
      });
    }
  });
};

const getMessagesRoom = async (payload) => {
  const { id } = payload;

  const room = await fetch(`http://localhost:3000/rooms/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
  })
    .then((response) => response.json())
    .then((res) => res);

  const { messages } = room;

  messages.forEach((messageRoom) => {
    renderMessagesRoom({
      message: messageRoom.message,
      name: messageRoom.messageFrom,
      isPrivate: true,
    });
  });
};

const saveMessages = async (payload) => {
  const { message, isPrivate, messageFor, roomName, isLeftRoom } = payload;

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
  } else if (roomName) {
    const response = await fetch('http://localhost:3000/message-rooms', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },

      body: JSON.stringify({
        message: message,
        messageFrom: isLeftRoom ? 'Boot' : infoUser.email,
        roomName,
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
  const roomFor = form.getAttribute('data-room_name');

  if (chatSocketId) {
    saveMessages({ isPrivate: true, message, messageFor });
    socket.emit('private-message', { message, to: chatSocketId });
    renderMessagesPrivados({
      userId: infoUser.id,
      message,
      name: infoUser.email,
      isPrivate: true,
    });
  } else if (roomFor) {
    saveMessages({ roomName: roomFor, message });
    socket.emit('room-message', { message, to: roomFor });
    renderMessagesRoom({
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

btnOut.addEventListener('click', () => {
  const roomName = form.getAttribute('data-room_name');
  socket.emit('leave-room', { roomName, email: infoUser.email });
});

const leaveRoom = async (payload) => {
  const { email, roomName, room, message } = payload;

  if (email !== infoUser.email) {
    await saveMessages({
      userId: infoUser.id,
      message,
      name: infoUser.email,

      isLeftRoom: true,
      roomName,
    });
  } else {
    const users = await fetch(`http://localhost:3000/user-rooms`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
    })
      .then((response) => response.json())
      .then((res) => res);

    const userDelete = users.filter((user) => {
      if (user.email === email && room.roomName === user.room.roomName) {
        return user;
      }
    });

    await fetch(`http://localhost:3000/user-rooms/${userDelete[0].id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
    })
      .then((response) => response.json())
      .then((res) => res);

    chatContainer.style.visibility = 'hidden';
    btnOut.style.visibility = 'hidden';
    await renderRoom();
  }
};

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
socket.on('room-message', renderMessagesRoom);

socket.on('join-room', renderRoom);

socket.on('leave-room', leaveRoom);
