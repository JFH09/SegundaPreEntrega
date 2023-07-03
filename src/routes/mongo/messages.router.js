import { Router } from "express";
import { messageModel } from "../../dao/models/message.model.js";

const router = Router();

router.post("/", async (req, res) => {
  const { user, message } = req.body;
  console.log("Creando nuevo chat...", user, message);
  let result = await messageModel.create({
    user,
    message,
  });

  console.log(result);

  res.status(201).json(result);
  //res.render("chat", { result });
  //res.send(result);
});

router.get("/messages", async (req, res) => {
  console.log("obteniendo mensajes...");
  let messages = await messageModel.find();
  console.log(messages);
  if (messages != []) {
    console.log("hay mensajes...");
  } else {
    console.log("No hay mensajes...");
  }
  res.status(201).json(messages);
});

router.get("/", async (req, res) => {
  console.log("obteniendo mensajes...");
  let messages = await messageModel.find();
  console.log(messages);
  if (messages != []) {
    console.log("hay mensajes...");
  } else {
    console.log("No hay mensajes...");
  }

  res.render("chat", { messages });
});

export default router;
