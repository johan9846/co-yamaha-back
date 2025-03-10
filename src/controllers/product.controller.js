const prisma = require("../config/database");

// Obtener todos los productos
const getProducts = async (req, res) => {
    try {
        const products = await prisma.product.findMany({ include: { category: true } });
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener productos" });
    }
};

// Crear un producto
const createProduct = async (req, res) => {
    try {
        const { brand, model, category_id, name, oldPrice, price, rating, image, description } = req.body;
        const product = await prisma.product.create({
            data: { brand, model, category_id, name, oldPrice, price, rating, image, description },
        });
        res.json(product);
    } catch (error) {
        res.status(400).json({ error: "No se pudo crear el producto" });
    }
};



// **Editar un producto por ID**
const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { brand, model, category_id, name, oldPrice, price, rating, image, description } = req.body;

        const existingProduct = await prisma.product.findUnique({ where: { id: Number(id) } });

        if (!existingProduct) {
            return res.status(404).json({ error: "Producto no encontrado" });
        }

        const updatedProduct = await prisma.product.update({
            where: { id: Number(id) },
            data: { brand, model, category_id, name, oldPrice, price, rating, image, description },
        });

        res.json(updatedProduct);
    } catch (error) {
        res.status(400).json({ error: "No se pudo actualizar el producto" });
    }
};

// **Eliminar un producto por ID**
const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        const existingProduct = await prisma.product.findUnique({ where: { id: Number(id) } });

        if (!existingProduct) {
            return res.status(404).json({ error: "Producto no encontrado" });
        }

        await prisma.product.delete({ where: { id: Number(id) } });

        res.json({ message: "Producto eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ error: "No se pudo eliminar el producto" });
    }
};

module.exports = { getProducts, createProduct, updateProduct, deleteProduct };


