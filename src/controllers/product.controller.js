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


// Buscar productos por coincidencia en el nombre
const searchProducts = async (req, res) => {
    try {
        const { query } = req.query; // Obtener el texto de búsqueda desde la URL (ejemplo: ?query=luc)

        if (!query) {
            return res.status(400).json({ error: "Debes proporcionar un término de búsqueda" });
        }

        const products = await prisma.product.findMany({
            where: {
                name: {
                    contains: query, // Busca coincidencias en cualquier parte del name
                    mode: "insensitive", // Hace la búsqueda sin distinguir entre mayúsculas y minúsculas
                },
            },
        });

        res.json(products);
    } catch (error) {
        res.status(500).json({ error: "Error al buscar productos" });
    }
};


const filterProducts = async (req, res) => {
    try {
        const { brand, model, category_id } = req.query;

        // Construimos dinámicamente el objeto de filtro
        const filters = {};
        if (brand) filters.brand = { contains: brand, mode: "insensitive" };
        if (model) filters.model = { contains: model, mode: "insensitive" };
        if (category_id) filters.category_id = Number(category_id); // Convertir a número

        const products = await prisma.product.findMany({
            where: filters,
            include: { category: true }, // Incluir categoría si se desea
        });

        res.json(products);
    } catch (error) {
        res.status(500).json({ error: "Error al filtrar productos" });
    }
};



module.exports = {filterProducts,searchProducts, getProducts, createProduct, updateProduct, deleteProduct };


