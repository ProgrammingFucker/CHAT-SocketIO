 const userSearchInput = document.getElementById("user-search");
  const userList = document.getElementById("user-list");

  // Función para filtrar la lista de usuarios según el término de búsqueda
  function filterUsers(searchTerm) {
    const users = userList.querySelectorAll("li");
    users.forEach((user) => {
      const name = user.textContent.toLowerCase();
      if (name.includes(searchTerm.toLowerCase())) {
        user.style.display = "block";
      } else {
        user.style.display = "none";
      }
    });
  }

  // Evento para actualizar la lista de usuarios en tiempo real
  socket.on("user-list", (users) => {
    userList.innerHTML = "";
    users.forEach((user) => {
      const li = document.createElement("li");
      li.textContent = user.username;
      li.dataset.id = user.id;
      li.addEventListener("click", () => {
        selectRecipient(user.id);
      });
      userList.appendChild(li);
    });
  });

  // Evento para actualizar la lista de usuarios cuando se conecta o desconecta un usuario
  socket.on("user-connected", (user) => {
    const li = document.createElement("li");
    li.textContent = user.username;
    li.dataset.id = user.id;
    li.addEventListener("click", () => {
      selectRecipient(user.id);
    });
    userList.appendChild(li);
  });

  socket.on("user-disconnected", (user) => {
    const li = userList.querySelector(`li[data-id="${user.id}"]`);
    li.remove();
  });

  // Evento para filtrar la lista de usuarios al escribir en el campo de búsqueda
  userSearchInput.addEventListener("input", () => {
    filterUsers(userSearchInput.value);
  });

