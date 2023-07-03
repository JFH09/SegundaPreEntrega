import express from "express";
import productsRoutes from "./routes/mongo/products.router.js";
import productsRoutesio from "./routes/mongo/productsio.router.js";
import cartsRouter from "./routes/mongo/carts.router.js";
import messagesRouter from "./routes/mongo/messages.router.js";
import __dirname from "./utils.js";
import mongoose from "mongoose";
import handlerbars from "express-handlebars";
import { Server } from "socket.io";

const app = express();
app.use(express.json());

const httpServer = app.listen(8080, () => console.log("Listen on PORT 8080"));
const io = new Server(httpServer);

app.use(express.urlencoded({ extended: true }));
app.engine("handlebars", handlerbars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");
app.use(express.static(__dirname + "/public"));
//pass: 12345
mongoose.connect(
  "mongodb+srv://julanfzh:12345@cluster0.5pmt2j5.mongodb.net/?retryWrites=true&w=majority"
);
app.use("/api/products", productsRoutes);
app.use("/home/products", productsRoutesio);
app.use("/api/carts", cartsRouter);
app.use("/api/chat", messagesRouter);
app.use("/", (req, resp) => {
  resp.send("Servidor Arriba!!! pruebe con =  algo");
});

io.on("connection", (socket) => {
  //cuando escuche que una vista - cliente se conecte...
  console.log("Nuevo Cliente Conectado...");
  io.emit("getListaProductos");

  socket.on("productoAgregado", (product) => {
    console.log("producto agregado... ");

    io.emit("getListaProductos");
  });

  socket.on("eliminarProducto", (idEliminar) => {
    console.log("entro a eliminar id-> ");
    io.emit("getListaProductos");
  });

  socket.on("productoEditado", (product) => {
    console.log("entro a editado  ");
    io.emit("getListaProductos");
  });

  socket.emit("getCart");

  socket.on("quitoCarrito", (product) => {
    console.log("se quito o disminuto un producto");
    socket.emit("getCart");
  });
});

//app.listen(8080, () => console.log("Escuchando por el puerto 8080"));
