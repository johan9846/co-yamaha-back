const express = require("express");
const { getOrder, createOrder } = require("../controllers/order.controller");
const prisma = require("../config/database");
const router = express.Router();

router.get("/allOrder", getOrder); // Corrección: Llamar al controlador directamente
router.post("/addOrder", createOrder); // Corrección: Llamar al controlador directamente

router.post("/pay", async (req, res) => {
  try {
    const { x_response, x_id_invoice } = req.query;
    console.log(req.query);

    if (!x_response || !x_id_invoice) {
      return res.status(200).json("request accepted without query parameters");
    }

    if (x_response !== "Aceptada") {
      return res.status(200).json("request accepted but denied transaction");
    }

    // 1️⃣ Buscar la orden con los productos
    const order = await prisma.order.findUnique({
      where: { id: x_id_invoice }
    });

    if (!order) {
      return res.status(404).json({ message: "Orden no encontrada" });
    }

    // 2️⃣ Parsear los productos 
    const products = (order.products);
  

    // 3️⃣ Recorrer cada producto en la orden y actualizar su stock
    for (const item of products ) {
      await prisma.product.update({
        where: { id: item.id }, // ID del producto
        data: { quantity_stock: { decrement: item.quantity } }, // Restar la cantidad comprada
      });
    }

    // 4️⃣ Marcar la orden como pagada
    await prisma.order.update({
      where: { id: order.id },
      data: { isPaid: true },
    });

    return res.status(200).json({ message: "Pago confirmado y stock actualizado" });

  } catch (error) {
    console.error("Error en la confirmación del pago:", error);
    return res.status(500).json({ message: "Error en el servidor" });
  }
});


module.exports = router;
