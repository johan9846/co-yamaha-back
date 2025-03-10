const prisma = require("../config/database");

// Obtener todas las categorías
const getCategories = async (req, res) => {
    try {
        const categories = await prisma.category.findMany({ include: { products: true } });
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
        res.status(201).json({
            message: "Category added successfully",
            data: category,
        });
    } catch (error) {
        console.error("Error during adding Category:", error);
        res.status(400).json({ error: "No se pudo crear la categoría" });
    }
};

module.exports = { getCategories, createCategory };
