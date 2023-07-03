console.log("Llamando a productos...");
const socket = io();
let currentUrl = window.location.href;
let totalDocs = "";
let limit = "";
let totalPages = "";
let page = "";
let pagingCounter = "";
let hasPrevPage = "";
let hasNextPage = "";
let prevPage = "";
let nextPage = "";

socket.on("getListaProductos", (data) => {
  console.log("se van a obtener la lista de productos....");
  getProducts();
  socket.emit("contraResp");
});

socket.on("fin", (data) => {
  console.log("entro a fin...");
});

async function getProducts() {
  console.log("ENTRO A GETPRODUCTS !!!!!");
  let arregloProductos = [];
  let productos = "";
  let listaProductos = document.getElementById("listaProductos");
  console.log("url", currentUrl);
  let url = currentUrl;

  let vars = url.split("?");
  console.log(vars[0]);
  console.log(vars[1]);
  //let varsLimit = vars[1].split("&");
  // console.log(varsLimit);
  // let tamVars = vars.length;
  // console.log(tamVars);
  let newUrl = "";
  if (vars[1] == undefined) {
    newUrl = currentUrl + "/productsList";
    console.log(newUrl);
  } else {
    newUrl = vars[0] + "/productsList?";
    newUrl = newUrl + vars[1];
    console.log(newUrl);
  }

  await fetch(newUrl)
    .then((response) => response.json())
    .then((result) => {
      console.log(typeof result);
      console.log(result.docs);
      // Manejar la respuesta del servidor
      arregloProductos = result.docs;
      limit = result.limit;
      totalPages = result.totalPages;
      page = result.page;
      pagingCounter = result.pagingCounter;
      hasPrevPage = result.hasPrevPage;
      hasNextPage = result.hasNextPage;
      prevPage = result.prevPage;
      nextPage = result.nextPage;
    });
  console.log(arregloProductos);
  console.log(
    totalDocs,
    limit,
    totalPages,
    page,
    pagingCounter,
    hasPrevPage,
    hasNextPage,
    prevPage,
    nextPage
  );

  arregloProductos.forEach((producto) => {
    productos =
      productos +
      `
    <div class="card col-3 mb-2" style="margin:3px; width:49%; " id="${producto._id}">
        <div class="row ">
            <div class="col-md-4 ">
                <img src="https://cdn-icons-png.flaticon.com/512/2203/2203183.png"
                    class="img-fluid rounded-start" style="padding-top: 15px; width:93%" alt="imagen-producto">
                <div class="">
                    <p class="card-text">Thumbnail: ${producto.thumbnail} </p>   
                </div>
            </div>
            <div class="col-md-8">
                <div class="card-body cardEstudiante">
                    <h5 class="card-title" > Title:  ${producto.title}</h5>
                    <h5 class="card-text"> Id: ${producto._id} </h5>
                    <p class="card-text">Price: ${producto.price}</p>
                    <p class="card-text">Code: ${producto.code}  </p>
                    <p class="card-text">Stock: ${producto.stock} </p>

                    <p class="card-text">Description: <br>  ${producto.description}</p>

                    <button class="btn btn-primary m-1"  onclick="editarProducto('${producto._id}')">Editar</button>
                    <button class="btn btn-danger m-1" onclick="eliminarProducto('${producto._id}')">Eliminar</button>
                </div>
            </div>
        </div>
    </div>
    `;
  });
  listaProductos.innerHTML = productos;

  //Para utlNexPage =
  let urlNextPage = "";
  urlNextPage = vars[0] + "?";
  console.log(vars);
  let variables = vars[1];
  let vars1 = variables.split("&");
  console.log(vars1);
  console.log(vars1.indexOf(`page=${page}`));
  let existe = vars1.includes(`page=${page}`);
  if (existe) {
    let posPage = vars1.indexOf(`page=${page}`);
    vars1[posPage] = "page=" + nextPage;
  } else {
    vars1.push("page=" + nextPage);
  }
  let newVars = "";
  console.log(vars1);
  vars1.forEach((e) => {
    newVars = newVars + e + "&";
  });
  let tamVars = newVars.length;
  newVars = newVars.slice(0, tamVars - 1);
  console.log(newVars);
  urlNextPage = urlNextPage + newVars;
  console.log(urlNextPage);

  let urlPrevPage = "";
  urlPrevPage = vars[0] + "?";
  console.log(vars);
  let variablesPrev = vars[1];
  let varsPrev = variablesPrev.split("&");
  console.log(varsPrev);
  console.log(varsPrev.indexOf(`page=${page}`));
  let existePrev = varsPrev.includes(`page=${page}`);
  if (existePrev) {
    let posPage = varsPrev.indexOf(`page=${page}`);
    varsPrev[posPage] = "page=" + prevPage;
  }
  let newVarsPrev = "";
  console.log(varsPrev);
  varsPrev.forEach((e) => {
    newVarsPrev = newVarsPrev + e + "&";
  });
  let tamVarsPrev = newVarsPrev.length;
  newVarsPrev = newVarsPrev.slice(0, tamVarsPrev - 1);
  console.log(newVarsPrev);
  urlPrevPage = urlPrevPage + newVarsPrev;
  console.log(urlPrevPage);

  let listaBotones = "";
  let botones = document.getElementById("botones");

  let habilitarPrev = "";
  let habilitarNext = "";
  if (prevPage == null) {
    habilitarPrev = "disabled";
  } else {
    habilitarPrev = "";
  }
  if (nextPage == null) {
    habilitarNext = "disabled";
  } else {
    habilitarNext = "";
  }
  listaBotones = `
    <button type="button" ${habilitarPrev} class="btn btn-secondary" onclick="location.href='${urlPrevPage}'">Previus</button>
    <button type="button" class="btn btn-secondary">${page}</button>
    <button type="button" ${habilitarNext}  class="btn btn-secondary" onclick="location.href='${urlNextPage}'">Next</button>
  `;
  botones.innerHTML = listaBotones;
}

async function agregarProducto() {
  const listaProductos = document.getElementById("listaProductos");
  const productos = "";
  let valido = true;
  //console.log("entro a agregar producto...");
  const { value: formValues } = await Swal.fire({
    title: "Agregar Producto:",
    html:
      '<input id="swal-input1" class="swal2-input"  placeholder="Title">' +
      '<input id="swal-input2" class="swal2-input"  placeholder="Description">' +
      '<input id="swal-input3" class="swal2-input"  placeholder="Price">' +
      '<input id="swal-input4" class="swal2-input"  placeholder="Thumbnail">' +
      '<input id="swal-input5" class="swal2-input"  placeholder="Code">' +
      '<input id="swal-input6" class="swal2-input"  placeholder="Stock">',
    focusConfirm: false,
    preConfirm: () => {
      return [
        document.getElementById("swal-input1").value,
        document.getElementById("swal-input2").value,
        document.getElementById("swal-input3").value,
        document.getElementById("swal-input4").value,
        document.getElementById("swal-input5").value,
        document.getElementById("swal-input6").value,
      ];
    },
  });

  for (let element in formValues) {
    if (
      formValues[element] == null ||
      formValues[element] == "" ||
      formValues[element] == 0
    ) {
      valido = false;
    }
  }

  if (formValues && valido) {
    console.log(formValues[0]);
    let producto = {
      title: formValues[0],
      description: formValues[1],
      price: formValues[2],
      thumbnail: formValues[3],
      code: formValues[4],
      stock: formValues[5],
      //id: ultimoId + 1,
    };
    console.log("en index producto: ", producto);

    await fetch(currentUrl + "/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(producto),
    })
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        // Manejar la respuesta del servidor
      });
    socket.emit("productoAgregado", producto);
    Swal.fire("Producto Agregado con exito!!!", "", "success");
  } else {
    Swal.fire("no se agrego ningun producto!!!", "", "info");
  }
}

async function eliminarProducto(idEliminar) {
  // console.log("id a eliminar - ", idEliminar);
  await fetch(currentUrl + `/${idEliminar}`, {
    method: "DELETE",
    // headers: {
    //   "Content-Type": "application/json",
    // },
    //body: JSON.stringify(producto),
  })
    .then((response) => response.json())
    .then((result) => {
      console.log(result);
      // Manejar la respuesta del servidor
    });
  socket.emit("eliminarProducto", idEliminar);
  Swal.fire("Se elimino el producto correctamente!!!", "", "info");
}

async function editarProducto(productId) {
  //let product = "";

  console.log(productId);
  let product = await obtenerProductoById(productId);
  console.log("modtrando Product desde editar.....");
  console.log(product);
  let valido = true;

  //console.log(product);
  const { value: formValues } = await Swal.fire({
    title: "Editar Producto:",
    html:
      '<input id="swal-input1" class="swal2-input"  placeholder="Title" value= ' +
      product.title +
      ">" +
      '<input id="swal-input2" class="swal2-input"  placeholder="Description" value= ' +
      product.description +
      ">" +
      '<input id="swal-input3" class="swal2-input"  placeholder="Price" value= ' +
      product.price +
      ">" +
      '<input id="swal-input4" class="swal2-input"  placeholder="Thumbnail" value= ' +
      product.thumbnail +
      ">" +
      '<input id="swal-input5" class="swal2-input"  placeholder="Code" value= ' +
      product.code +
      ">" +
      '<input id="swal-input6" class="swal2-input"  placeholder="Stock" value=' +
      product.stock +
      ">",
    focusConfirm: false,
    preConfirm: () => {
      return [
        document.getElementById("swal-input1").value,
        document.getElementById("swal-input2").value,
        document.getElementById("swal-input3").value,
        document.getElementById("swal-input4").value,
        document.getElementById("swal-input5").value,
        document.getElementById("swal-input6").value,
      ];
    },
  });

  for (let element in formValues) {
    console.log(formValues[element]);
    if (
      formValues[element] == null ||
      formValues[element] == "" ||
      formValues[element] == 0
    ) {
      valido = false;
    }
  }

  // :(
  // console.log("fomValues:::::::::::::");
  // console.log(formValues, valido);
  if (formValues && valido) {
    //console.log(formValues[0]);
    let producto = {
      title: formValues[0],
      description: formValues[1],
      price: formValues[2],
      thumbnail: formValues[3],
      code: formValues[4],
      stock: formValues[5],
      id: product.id,
    };
    console.log("producto editado final -> ", producto);
    await fetch(currentUrl + "/" + productId, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(producto),
    })
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
      });
    socket.emit("productoEditado", producto);
    Swal.fire("Producto editado con exito!!!", "", "success");
  } else {
    Swal.fire("no se edito el producto!!!", "", "info");
  }
}

function enviandoValores(formValues) {
  console.log(JSON.stringify(formValues));
}
async function obtenerProductoById(productId) {
  console.log("enrto a obtener producto ById ", productId);
  let product = "";
  await fetch(currentUrl + "/" + productId)
    .then((response) => response.json())
    .then((result) => {
      console.log("Result en obtenerProductoById");
      console.log(result);
      //console.log(result.docs);
      // Manejar la respuesta del servidor
      product = result;
    });
  console.log("enviando product desde obtenerProductoById", product);
  return product;
}
