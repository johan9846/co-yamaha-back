const prisma = require("../config/database");

// Obtener todas las categorías
const getCategories = async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      include: { products: true },
    });
    res.status(200).json({
      message: "Successfully obtained categories",
      data: categories,
    });
  } catch (error) {
    console.error("Error during getting categories:", error);
    res.status(500).json({ error: "Error al obtener categorías" });
  }
};

// Crear una categoría
const createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ error: "El nombre es obligatorio" });
    }

    const category = await prisma.category.create({ data: { name } });
    res.status(200).json({
      message: "Category added successfully",
      data: category,
    });
  } catch (error) {
    console.error("Error during adding Category:", error);
    res.status(400).json({ error: "No se pudo crear la categoría" });
  }
};


const getCategoryProducts = async (req, res) => {
  try {
    const category = await prisma.category.findUnique({
      where: { id: Number(req.params.id) },
      select: {
        products: {
          include: {
            category: true, // Incluimos la categoría en cada producto
          },
        },
      },
    });

    if (!category) {
      return res.status(404).json({ error: "Categoría no encontrada" });
    }

    res.json(category.products); // Retornamos los productos con su categoría incluida
  } catch (error) {
    console.error("Error al obtener los productos de la categoría:", error);
    res
      .status(500)
      .json({ error: "Error al obtener los productos de la categoría" });
  }
};



const updateCategory = async (req, res) => {
  try {
      const { id } = req.params;
      const {name, status } = req.body;

      const existingCategory = await prisma.category.findUnique({ where: { id: Number(id) } });

      if (!existingCategory) {
          return res.status(404).json({ error: "categoria no encontrado" });
      }

      const updateCategory = await prisma.category.update({
          where: { id: Number(id) },
          data: { name, status },
      });

      res.json(updateCategory);
  } catch (error) {
      res.status(400).json({ error: "No se pudo actualizar categoria" });
  }
};


module.exports = {
  getCategoryProducts,
  getCategories,
  createCategory,
  updateCategory
};
