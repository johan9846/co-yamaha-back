const prisma = require("../config/database");

// Obtener todas las órdenes
const getOrder = async (req, res) => {
  try {
    const orders = await prisma.order.findMany();
    res.status(200).json({
      message: "Successfully obtained orders",
      data: orders,
    });
  } catch (error) {
    console.error("Error during getting orders:", error);
    res.status(500).json({ error: "Error al obtener órdenes" });
  }
};

// Crear una orden
const createOrder = async (req, res) => {
    try {
      const { name, last_name, phone, departament, city, address, products } = req.body;
  
      // Validar que los campos requeridos estén presentes
      if (!name || !last_name || !phone || !departament || !city || !address || !products || !Array.isArray(products)) {
        return res.status(400).json({ error: "Todos los campos son obligatorios y 'products' debe ser un array" });
      }
  
      // Crear la orden en la base de datos
      const order = await prisma.order.create({
        data: {
          name,
          last_name,
          phone,
          departament,
          city,
          address,
          isPaid: false, // Valor por defecto
          products: products, // Prisma automáticamente lo almacena como JSON
        },
      });
  
      res.status(200).json({
        message: "Order added successfully",
        data: order,
      });
    } catch (error) {
      console.error("Error al agregar la orden:", error);
      res.status(500).json({ error: "No se pudo crear la orden" });
    }
  };
  
module.exports = {
  getOrder,
  createOrder,
};
