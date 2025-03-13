const cloudinary = require("../config/cloudinary"); // ✅ Importa correctamente en CommonJS

const prisma = require("../config/database");

console.log(cloudinary, "cloudinary " )




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
    let { brand, model, category_id, name, oldPrice, price, rating, quantity_stock, description } = req.body;

    // Convertir valores numéricos
    category_id = category_id ? Number(category_id) : null; // ✅ Opcional: null si no se envía
    oldPrice = parseFloat(oldPrice);
    price = parseFloat(price);
    rating = parseFloat(rating);
    quantity_stock = parseInt(quantity_stock, 10);

 

    if (!req.file) {
      return res.status(400).json({ error: "No se ha proporcionado una imagen" });
    }

    // Sube la imagen a Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "productos",
      resource_type: "image",
    });

    // Crea el producto con la URL de la imagen subida
    const product = await prisma.product.create({
      data: {
        brand,
        model,
        category_id, 
        name,
        oldPrice,
        price,
        rating,
        image: result.secure_url,
        quantity_stock,
        description,
      },
    });

    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "No se pudo crear el producto" });
  }
};


// **Editar un producto por ID**
const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { brand, model, category_id, name, oldPrice, price, rating, image, quantity_stock, description } = req.body;

        const existingProduct = await prisma.product.findUnique({ where: { id: Number(id) } });

        if (!existingProduct) {
            return res.status(404).json({ error: "Producto no encontrado" });
        }

        const updatedProduct = await prisma.product.update({
            where: { id: Number(id) },
            data: { brand, model, category_id, name, oldPrice, price, rating, image, quantity_stock, description },
        });

        res.json(updatedProduct);
    } catch (error) {
        res.status(400).json({ error: "No se pudo actualizar el producto" });
    }
};




const deleteProduct = async (req, res) => {
    try {
      const { ids } = req.body; // Recibe siempre un array de IDs
  
      if (!Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({ error: "The 'ids' array is required and cannot be empty" });
      }
  
      // 🟢 Prisma deleteMany devuelve { count: número }
      const deletedRowCount = await prisma.product.deleteMany({
        where: { id: { in: ids } }, // Asegurarse de usar `in`
      });
  
      if (deletedRowCount.count === 0) {
        return res.status(404).json({ error: "No product found to delete" });
      }
  
      return res.status(200).json({ message: `Deleted ${deletedRowCount.count} product successfully` });
  
    } catch (error) {
      console.error("Error during deleteproduct:", error);
      return res.status(500).json({ error: "Error deleting product" });
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
            include: { category: true }, // Incluir la categoría en la respuesta
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


