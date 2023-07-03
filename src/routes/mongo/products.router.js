import { Router } from "express";
import productModel from "../../dao/models/product.model.js";

const router = Router();

router.get("/", async (req, res) => {
  console.log(
    "entro aqui... *****************************************************"
  );

  const limit = req.query.limit || 10; // Establecer 10 como valor predeterminado si no se proporciona
  const page = req.query.page || 1; // Establecer 1 como valor predeterminado si no se proporciona
  const orden = req.query.sort || ""; // Establecer una cadena vacía como valor predeterminado si no se proporciona
  const query = req.query.query || ""; // Establecer una cadena vacía como valor predeterminado si no se proporciona
  //CREO QUE EL QUERY SE DEBERIA PODER HACER POR CATEGORIA O POR DISPONIBILIDAD(?)
  //EL ORDENAMIENTO TAMBIEN PODRIA REALIZARSE POR PRECIO ASC/DESC...

  console.log("valor para limit:", limit);
  console.log("valor para page:", page);
  console.log("filtro de búsqueda:", query);
  console.log("orden de búsqueda:", orden);

  // let orders = await productModel.aggregate([
  //   {
  //     $match: { title: "papas" },
  //   },
  // ]);
  // console.log("Ordersssss....", orders);

  let filtro;
  if (query == "") {
    filtro = {};
  } else {
    filtro = { title: query };
  }

  try {
    let products = await productModel.paginate(
      filtro,
      { limit: limit, page: page, sort: { price: orden } }
      //{ limit: 1, page: 2 } el limite es para cant por pagina, y el page es que pagina va a mostrar...
    );
    console.log("Paginate:", products);
    //res.send({ status: "success", products });
    res.render("products", { products });
    //res.status(201).json(products);
  } catch (err) {
    console.log("No se pudo obtener los productos con mongoose : ", err);

    res.render("products", { status: `error: ${err}`, products });
  }
});

router.get("/productsList", async (req, res) => {
  console.log(
    "entro aqui... *****************************************************"
  );

  const limit = req.query.limit || 10; // Establecer 10 como valor predeterminado si no se proporciona
  const page = req.query.page || 1; // Establecer 1 como valor predeterminado si no se proporciona
  const orden = req.query.sort || ""; // Establecer una cadena vacía como valor predeterminado si no se proporciona
  const query = req.query.query || ""; // Establecer una cadena vacía como valor predeterminado si no se proporciona
  //CREO QUE EL QUERY SE DEBERIA PODER HACER POR CATEGORIA O POR DISPONIBILIDAD(?)
  //EL ORDENAMIENTO TAMBIEN PODRIA REALIZARSE POR PRECIO ASC/DESC...

  console.log("valor para limit:", limit);
  console.log("valor para page:", page);
  console.log("filtro de búsqueda:", query);
  console.log("orden de búsqueda:", orden);

  // let orders = await productModel.aggregate([
  //   {
  //     $match: { title: "papas" },
  //   },
  // ]);
  // console.log("Ordersssss....", orders);

  let filtro;
  if (query == "") {
    filtro = {};
  } else {
    filtro = { title: query };
  }

  try {
    let products = await productModel.paginate(
      filtro,
      { limit: limit, page: page, sort: { price: orden } }
      //{ limit: 1, page: 2 } el limite es para cant por pagina, y el page es que pagina va a mostrar...
    );
    console.log("Paginate:", products);
    //res.send({ status: "success", products });
    //res.render("products", { products });
    res.status(201).json(products);
  } catch (err) {
    console.log("No se pudo obtener los productos con mongoose : ", err);

    ///res.render("products", { status: `error: ${err}`, products });
    res.status(400).json("error", err);
  }
});

// router.get("/:id", async (req, res) => {
//   console.log("ENTRO A GET ID ***************");
//   let { id } = req.params;
//   console.log("Entro a obtener product by id", id);
//   try {
//     let producto = await productModel.findOne({ _id: id });
//     console.log("producto...**********");
//     console.log(producto);
//     res.status(201).json(producto);
//   } catch (error) {
//     console.log("No se pudo obtener los productos con mongoose : ", error);
//     res.status(400).json("error", error);
//   }
// });

router.post(
  /*"/:title/:description/:price/:thumbnail/:code/:stock"*/ "/",
  async (req, res) => {
    console.log("entro a post ...");

    //let { title, description, price, thumbnail, code, stock } = req.params;
    console.log(req.body.title);
    let { title, description, price, thumbnail, code, stock } = req.body;

    if (!title || !description || !price || !thumbnail || !code || !stock) {
      console.log("entro a condicional de valores incompletos");
      return res.json({ result: "error", error: "Valores incompletos..." });
    }

    let productExist = await productModel.findOne({ code });

    if (productExist) {
      console.log("existe", productExist);
      res.send(
        `El producto con code ${code} ya existe, intente nuevamente con otro code...`
      );
    } else {
      console.log("no existe", productExist);
      try {
        let result = await productModel.create({
          title,
          description,
          price,
          thumbnail,
          code,
          stock,
        });
        res.status(201).json({ result: "success", payload: result });
      } catch (err) {
        console.log("No se pudo agregar un producto...", err);
      }
    }
  }
);

router.put("/:id", async (req, res) => {
  let { id } = req.params;

  let productToReplace = req.body;
  if (
    !productToReplace.title ||
    !productToReplace.description ||
    !productToReplace.price ||
    !productToReplace.thumbnail ||
    !productToReplace.code ||
    !productToReplace.stock
  ) {
    console.log("entro a condicional de valores incompletos");
    return res.json({ result: "error", error: "Valores incompletos..." });
  }

  let result = await productModel.updateOne({ _id: id }, productToReplace);
  res.json({ status: "success", payload: result });
});

router.delete("/:id", async (req, res) => {
  let { id } = req.params;

  let result = await productModel.deleteOne({ _id: id });
  res.json({ status: "success", payload: result });
});

export default router;
