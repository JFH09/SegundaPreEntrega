console.log("entro a chat...");
let user;
let currentUrl = window.location.href;

Swal.fire({
  title: "Identificate",
  input: "text",
  text: "Ingresa tu nombre de usuario",
  inputValidator: (value) => {
    return !value && "necesitas escribir un nombre de usuario para continuar!!";
  },
  allowOutsideClick: false,
}).then((result) => {
  console.log(result.isConfirmed);
  if (result.isConfirmed) {
    user = result.value;
    console.log(user);
    let tituloChat = document.getElementById("tituloChat");
    tituloChat.innerHTML = `Chat de ${user}`;
    getMessages();
    Swal.fire("Logueado con exito!!!", "", "success");
  } else {
    Swal.fire("Changes are not saved", "", "info");
  }
});

let btnSendMessage = document.getElementById("sendMessage");

btnSendMessage.addEventListener("click", () => {
  let inputMessage = document.getElementById("mensaje");
  console.log(inputMessage.value);

  sendMessage(inputMessage.value);
  getMessages();
});

async function sendMessage(message) {
  console.log("intentando enviar -> ", message);
  // console.log(window.location.href);
  // let currentUrl = window.location.href;
  // window.location.href = currentUrl + `${user}/${message.trim()}`;
  let data = {
    user: user,
    message: message,
  };

  await fetch(currentUrl + "/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((result) => {
      console.log(result);
      // Manejar la respuesta del servidor
    });
}

async function getMessages() {
  let arregloMensajes = [];
  let contenedorMensajes = document.getElementById("contenedorMensajes");
  contenedorMensajes.innerHTML = "";
  let inputMessage = document.getElementById("mensaje");
  inputMessage.value = "";
  console.log("get messages -> ");
  await fetch(currentUrl + "/messages")
    .then((response) => response.json())
    .then((result) => {
      console.log(typeof result);
      // Manejar la respuesta del servidor
      arregloMensajes = result;
    });
  arregloMensajes = arregloMensajes.reverse();
  console.log(arregloMensajes);
  arregloMensajes.forEach((element) => {
    //console.log(element);
    //let contenedorMensajes = document.createElement("contenedorMensaje");
    let composicionMensaje = document.createElement("div");
    let mensaje = document.createElement("h3");
    //let user = document.createElement("h4");
    console.log(user);
    if (element.user == user) {
      console.log("es igual al usuario logueado...");
      composicionMensaje.className = "card-body text-bg-info";
      composicionMensaje.style =
        "max-width: auto; align-self: flex-end; text-align:end";
      composicionMensaje.innerHTML = `
   
          <h5 class="card-title" id="ususario">${element.user}</h5>
          <p class="card-text" id="mensaje">${element.message}</p>
      
      `;
    } else {
      composicionMensaje.className = "card-body text-bg-primary";
      composicionMensaje.style = "max-width: 60%; text-align:start;";
      composicionMensaje.innerHTML = `
        <h5 class="card-title" id="ususario">${element.user}</h5>
        <p class="card-text" id="mensaje">${element.message}</p>
      `;
    }

    // user.innerHTML = element.user;
    // mensaje.innerHTML = element.message;

    // listaMensajes.append(user);
    //listaMensajes.append(mensaje);
    console.log(composicionMensaje);
    contenedorMensajes.append(composicionMensaje);
    console.log(contenedorMensajes);
  });
}
