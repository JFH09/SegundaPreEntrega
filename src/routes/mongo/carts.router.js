import { Router } from "express";
import { cartModel } from "../../dao/models/cart.model.js";

const router = Router();

router.get("/", async (req, res) => {
  console.log("obteniendo lista total de carritos :");
  try {
    let carts = await cartModel.find();
    res.json({ result: "success", payload: carts });
  } catch (err) {
    console.log("No se pudo obtener el carrito con mongoose : ", err);
  }
});

router.get("/:id", async (req, res) => {
  console.log(req.params.id);
  let idCarrito = req.params.id;
  console.log("idCart 19 : ", idCarrito);
  console.log("obteniendo carrito by id: 20");
  try {
    let cart = await cartModel.findOne({ _id: "649e7d15cb463aef3c6b25a9" });

    //  .populate("products.product");
    console.log(cart);
    if (cart != null) {
      res.render("cart", { cart });
    } else {
      res.render("cart", {});
    }
    //console.log(cart._id);
    //res.json({ result: "success", payload: carts });
    //res.status(201).json(carts);
  } catch (err) {
    console.log("No se pudo obtener el carrito con mongoose : ", err);
  }
});
router.get("/:id/carrito", async (req, res) => {
  let idCarrito = req.params.id;
  console.log("idCart 36 : ", idCarrito);
  console.log("obteniendo carrito by id: 37");
  try {
    let cart = await cartModel
      .findOne({ _id: idCarrito })
      .populate("products.product");
    //console.log(cart);
    //res.json({ result: "success", payload: carts });
    res.status(201).json(cart);
    //res.render("cart", {});
  } catch (err) {
    console.log("No se pudo obtener el carrito con mongoose : ", err);
  }
});
//AGREGANDO PRODUCTO A CARRITO
// router.put("/:idCarrito/:product/:idProduct", async (req, res) => {
//   let quantity = req.body;
//   console.log(quantity);
//   let { idCarrito, product, idProduct } = req.params;

//   //console.log("entro a post ...", req.body.products);
//   console.log("entro a post ...");
//   console.log("agregando el carrito con la info -> ", product);

//   if (!product || !idProduct || !idCarrito) {
//     console.log("entro a condicional de valores incompletos");
//     return res.json({ result: "error", error: "Valores incompletos..." });
//   }

//   console.log("buscando si existe un carrito con el id ", idCarrito);

//   let cart = await cartModel.findOne({ _id: idCarrito });
//   console.log("result: ", cart);

//   if (!cart) {
//     quantity = 1;
//     console.log("No se encontro el carrito...");
//     console.log("se debe crear un nuevo carrito....");
//     console.log(
//       "puede que no exista el carrito con ese id, para poder agregar un product cree un nuevo carro ..."
//     );

//     return res.json({
//       result: "error",
//       error: "e debe crear un nuevo carrito....",
//     });
//   } else {
//     console.log("si existe el carrito ...Agregando el producto al carrito...");
//     console.log(
//       "buscando la posicion y datos del idproduct que hay que agregar..."
//     );
//     let productPosc = cart.products.findIndex(
//       (elemento) => elemento.product == product
//     );
//     let productData = cart.products.find(
//       (elemento) => elemento.product == product
//     );

//     console.log(productData);
//     if (!productData) {
//       quantity = 1;
//       productData = { product, quantity, idProduct };
//       cart.products.push(productData);
//     } else {
//       productData.quantity = productData.quantity + 1;
//       cart.products[productPosc] = productData;
//     }

//     console.log(cart);
//     let result = await cartModel.updateOne({ _id: idCarrito }, cart);
//     res.json({ status: "success", payload: result });
//   }
// });

//AGREGANDO N PRODUCTOS A CARRITO
router.put("/:idCarrito/:product/:idProduct/2", async (req, res) => {
  let { quantity } = req.body;
  console.log(quantity);
  let { idCarrito, product, idProduct } = req.params;

  //console.log("entro a post ...", req.body.products);
  console.log("entro a post ...");
  console.log("agregando el carrito con la info -> ", product);

  if (!product || !idProduct || !idCarrito) {
    console.log("entro a condicional de valores incompletos");
    return res.json({ result: "error", error: "Valores incompletos..." });
  }

  console.log("buscando si existe un carrito con el id ", idCarrito);

  let cart = await cartModel.findOne({ _id: idCarrito });
  console.log("result: ", cart);

  if (!cart) {
    quantity = 1;
    console.log("No se encontro el carrito...");
    console.log("se debe crear un nuevo carrito....");
    console.log(
      "puede que no exista el carrito con ese id, para poder agregar un product cree un nuevo carro ..."
    );

    return res.json({
      result: "error",
      error: "e debe crear un nuevo carrito....",
    });
  } else {
    console.log("si existe el carrito ...Agregando el producto al carrito...");
    console.log(
      "buscando la posicion y datos del idproduct que hay que agregar..."
    );
    let productPosc = cart.products.findIndex(
      (elemento) => elemento.product == product
    );
    let productData = cart.products.find(
      (elemento) => elemento.product == product
    );

    console.log(productData);
    if (!productData) {
      //quantity = 1;
      productData = { product, quantity, idProduct };
      cart.products.push(productData);
    } else {
      productData.quantity = productData.quantity + quantity;
      cart.products[productPosc] = productData;
    }

    console.log(cart);

    try {
      let result = await cartModel.updateOne({ _id: idCarrito }, cart);
      res.json({ status: "success", payload: result });
    } catch (err) {
      console.log("No se pudo EDITAR el carrito, puede que no exista");
      res.json({
        result: "error",
        error: "No se pudo EDITAR el carrito, puede que no exista",
      });
    }
  }
});

router.put("/:idCarrito", async (req, res) => {
  let quantity = 0;
  let { idCarrito } = req.params;
  let arrayProducts = req.body;
  console.log(
    "agregando el carrito con la info -> ",
    idCarrito,
    "array",
    arrayProducts
  );

  if (!idCarrito || !arrayProducts) {
    console.log("entro a condicional de valores incompletos");
    return res.json({ result: "error", error: "Valores incompletos..." });
  }

  console.log("buscando si existe un carrito con el id ", idCarrito);

  let cart = await cartModel.findOne({ _id: idCarrito });
  console.log("result: ", cart);

  if (!cart) {
    console.log("No se encontro el carrito...");
    console.log("se debe crear un nuevo carrito....");
    console.log(
      "puede que no exista el carrito con ese id, para poder agregar un product cree un nuevo carro ..."
    );

    return res.json({
      result: "error",
      error: "Se debe crear un nuevo carrito....",
    });
  } else {
    console.log("si existe el carrito ...Agregando el producto al carrito...");

    arrayProducts.forEach((element) => {
      cart.products.push({
        product: element.idProduct,
        quantity: element.quantity,
      });
    });

    console.log(cart);

    try {
      let result = await cartModel.updateOne({ _id: idCarrito }, cart);
      res.json({ status: "success", payload: result });
      console.log(result);
    } catch (err) {
      console.log("No se pudo EDITAR el carrito, puede que no exista");
      res.json({
        result: "error",
        error: "No se pudo EDITAR el carrito, puede que no exista",
      });
    }
  }
});

//Agregando un nuevo carrito...
// router.post("/", async (req, res) => {
//   let products = [];
//   try {
//     let result = await cartModel.create({
//       products,
//     });
//     console.log("carrito agregado...");
//     res.status(201).json({ result: "success", payload: result });
//   } catch (err) {
//     console.log("No se pudo agregar un producto...", err)  ;
//   }
// });

router.delete("/:id", async (req, res) => {
  console.log("entro a eliminar carrito...");
  let { id } = req.params;

  try {
    let result = await cartModel.deleteOne({ _id: id });
    res.json({ status: "success", payload: result });
  } catch (err) {
    console.log("No se pudo eliminar el carrito, puede que no exista");
    res.json({
      result: "error",
      error: "No se pudo eliminar el carrito, puede que no exista",
    });
  }
});

// router.delete("/:idCarrito/product/:idProduct", async (req, res) => {
//   console.log("entro a eliminar carrito... 269");
//   let { idCarrito, product, idProduct } = req.params;
//   console.log(
//     `Se eliminara el producto ${product} con id ${idProduct} del carrito con id - ${idCarrito}`
//   );

//   let cart = await cartModel.findOne({ _id: idCarrito });
//   console.log("result: ", cart);

//   if (!cart) {
//     quantity = 1;
//     console.log("No se encontro el carrito...");
//     console.log("se debe crear un nuevo carrito....");
//     console.log(
//       "puede que no exista el carrito con ese id, para poder agregar un product cree un nuevo carro ..."
//     );

//     return res.json({
//       result: "error",
//       error: "Se debe crear un nuevo carrito....",
//     });
//   } else {
//     console.log(
//       "buscando la posicion y datos del idproduct que hay que eliminar..."
//     );
//     let productPosc = cart.products.findIndex(
//       (elemento) => elemento.product == product
//     );
//     let productData = cart.products.find(
//       (elemento) => elemento.product == product
//     );

//     console.log(productData);
//     if (productData.quantity == 1) {
//       //quantity = 1;

//       cart.products.splice(productPosc, 1);
//       console.log("Se ELIMINO UN PRODUCTO COMPLETO!!!!", cart.products);
//     } else if (productData.quantity > 1) {
//       productData.quantity = productData.quantity - 1;
//       cart.products[productPosc] = productData;
//       console.log("Se DISMINUYO EL NUMERO DE UN PRODUCTO!!!!", cart.products);
//     } else {
//       res.json({
//         status: "error: no se planteo algo... en delete de product",
//       });
//     }

//     console.log(cart);
//     try {
//       let result = await cartModel.updateOne({ _id: idCarrito }, cart);
//       res.json({ status: "success", payload: result });
//       console.log(result);
//     } catch (err) {
//       console.log("No se pudo eliminar el carrito, puede que no exista");
//       res.json({
//         result: "error",
//         error: "No se pudo eliminar el carrito, puede que no exista",
//       });
//     }
//   }
// });

router.post("/", async (req, res) => {
  let response = await cartModel.create({});
  res.json({ response: "Se creo el carrito...", result: response });
});
//Agregando id del producto al carrito...
router.put("/:idCart/:product/:idProduct", async (req, res) => {
  let idCart = req.params.idCart;
  let idProduct = req.params.idProduct;
  let { quantity } = req.body;

  console.log("product: ", idProduct, "idCart", idCart, "quantity", quantity);
  try {
    let carrito = await cartModel.find({ _id: idCart });
    let producto = await cartModel.find({ _id: idProduct });

    if (carrito && producto) {
      let cart = carrito[0];
      console.log("*****344", cart);
      console.log(carrito);
      console.log(carrito[0].products);
      let existe = false;
      let posicionProducto = "";
      cart.products.forEach((elemento) => {
        console.log("en foreach 355", elemento.product._id);
        if (elemento.product._id == idProduct) {
          //verificar tambien el code
          console.log("el producto existe en el carrito...");
          console.log(
            "Quantity de product guardado esta en :",
            elemento.quantity
          );
          quantity = elemento.quantity + quantity;
          existe = true;
          //let id = elemento.product.idCarrito.split('"');
          console.log(elemento._id);
          console.log("typeof -> ", typeof elemento._id);
          let el = elemento._id.toString();
          console.log("typeof -> ", typeof el);
          let div = el.split('"', 2);
          console.log("division", div[0]);
          div = div[0];
          console.log(cart.products);
          posicionProducto = cart.products.indexOf(elemento);
          //PENSAR COMO PUEDO OBTENER LA POSICION PARA QUE SI EXISTE ACTUALICE EL PRODUCT EN VEZ DE PUSHEARLO
          console.log("pos Product .> ", posicionProducto);
        } else {
          console.log("el producto NO  existe en el carrito...");
        }
      });

      console.log("LINE 385 Quantity quedo en :", quantity);
      console.log("Posicion Producto", posicionProducto);
      if (existe) {
        //cart.products[]
        console.log("actualizando producto en la posicion ", posicionProducto);
        console.log(cart.products[posicionProducto].quantity);
        cart.products[posicionProducto].quantity = quantity;
        console.log(cart.products[posicionProducto]);
      } else {
        cart.products.push({ product: idProduct, quantity: quantity });
      }

      let result = await cartModel.updateOne({ _id: idCart }, cart);

      res.json({ status: "success", result: result });
    } else {
      res.json({ status: "Error", result: "El carrito puede que no exista 1" });
    }
  } catch (err) {
    res.json({
      status: "Error",
      result: "El carrito puede que no exista 2",
      err,
    });
  }
});

//Disminuir cantidad de producto en carrito por id
router.delete("/:idCart/product/:idProduct", async (req, res) => {
  let idCart = req.params.idCart;
  let idProduct = req.params.idProduct;
  //let { quantity } = req.body;

  console.log("product: ", idProduct, "idCart", idCart);
  try {
    let carrito = await cartModel.find({ _id: idCart });
    let producto = await cartModel.find({ _id: idProduct });

    if (carrito && producto) {
      let cart = carrito[0];
      console.log("*****425", cart);
      console.log(carrito);
      console.log(carrito[0].products);
      let existe = false;
      let posicionProducto = "";
      cart.products.forEach((elemento) => {
        console.log("en foreach 355", elemento.product._id);
        if (elemento.product._id == idProduct) {
          //verificar tambien el code
          console.log("el producto existe en el carrito...");
          // console.log(
          //   "Quantity de product guardado esta en :",
          //   elemento.quantity
          // );
          //quantity = elemento.quantity - 1;
          console.log(elemento.quantity - 1);
          //console.log("quantity en disminuit line 438", quantity);
          existe = true;
          //let id = elemento.product.idCarrito.split('"');
          console.log(elemento._id);
          console.log("typeof -> ", typeof elemento._id);
          let el = elemento._id.toString();
          console.log("typeof -> ", typeof el);
          let div = el.split('"', 2);
          console.log("division", div[0]);
          div = div[0];
          console.log(cart.products);
          posicionProducto = cart.products.indexOf(elemento);
          console.log("pos Product .> ", posicionProducto);
        } else {
          console.log("el producto NO  existe en el carrito...");
        }
      });

      // console.log("Quantity quedo en :", quantity);
      console.log("Posicion Producto", posicionProducto);
      if (existe) {
        //cart.products[]
        console.log("actualizando producto en la posicion ", posicionProducto);
        console.log(cart.products[posicionProducto].quantity);
        cart.products[posicionProducto].quantity =
          cart.products[posicionProducto].quantity - 1;
        console.log(cart.products[posicionProducto]);
      } else {
        cart.products.push({ product: idProduct, quantity: quantity });
      }

      let result = await cartModel.updateOne({ _id: idCart }, cart);

      res.json({ status: "success", result: result });
    } else {
      res.json({ status: "Error", result: "El carrito puede que no exista 1" });
    }
  } catch (err) {
    res.json({
      status: "Error",
      result: "El carrito puede que no exista 2",
      err,
    });
  }
});

router.delete("/:idCart/:product/:idProduct", async (req, res) => {
  console.log("Eliminando todo el producto del carrito...");
  let idCart = req.params.idCart;
  let idProduct = req.params.idProduct;
  let product = req.params.product;
  //let { quantity } = req.body;

  console.log("product: ", idProduct, "idCart", idCart, "product", product);
  try {
    let carrito = await cartModel.find({ _id: idCart });
    let producto = await cartModel.find({ _id: idProduct });

    if (carrito && producto) {
      let cart = carrito[0];
      console.log("*****501", cart);
      console.log(carrito);
      console.log(carrito[0].products);
      let existe = false;
      let posicionProducto = "";
      cart.products.forEach((elemento) => {
        console.log("en foreach 507", elemento._id);
        if (elemento._id == idProduct) {
          //verificar tambien el code
          console.log("el producto existe en el carrito...");
          console.log(elemento.quantity - 1);
          existe = true;
          console.log(elemento._id);
          console.log("typeof -> ", typeof elemento._id);
          let el = elemento._id.toString();
          console.log("typeof -> ", typeof el);
          let div = el.split('"', 2);
          console.log("division", div[0]);
          div = div[0];
          console.log(cart.products);
          posicionProducto = cart.products.indexOf(elemento);
          console.log("pos Product .> ", posicionProducto);
        } else {
          console.log("el producto NO  existe en el carrito...");
        }
      });

      // console.log("Quantity quedo en :", quantity);
      console.log("Posicion Producto", posicionProducto);
      if (existe) {
        //cart.products[]
        console.log("actualizando producto en la posicion ", posicionProducto);
        //console.log(cart.products[posicionProducto].quantity);
        console.log("line 534");
        console.log(cart.products);
        cart.products = cart.products.filter(
          (e) => e != cart.products[posicionProducto]
        );
        console.log("line 539");
        console.log(cart.products);
      } else {
        res.json({
          status: "error",
          result: "No se pudo eliminar el producto del carrito",
        });
      }

      let result = await cartModel.updateOne({ _id: idCart }, cart);

      res.json({ status: "success", result: result });
    } else {
      res.json({ status: "Error", result: "El carrito puede que no exista 1" });
    }
  } catch (err) {
    res.json({
      status: "Error",
      result: "El carrito puede que no exista 2",
      err,
    });
  }
});

export default router;
