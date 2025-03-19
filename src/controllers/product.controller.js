const prisma = require("../config/database");

// Obtener todos los productos
const getProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: true, // ✅ Incluir la categoría
        brands: true,   // ✅ Incluir las marcas relacionadas
      },
    });

    res.json(products);
  } catch (error) {
    console.error("Error al obtener productos:", error);
    res.status(500).json({ error: "Error al obtener productos" });
  }
};


// Crear un producto
const createProduct = async (req, res) => {
  try {
    const {
      name,
      brands, // Array de marcas con modelos
      category_id,
      quantity_stock,
      oldPrice,
      price,
      rating,
      images,
      description,
    } = req.body;

    // Validaciones básicas
    if (!Array.isArray(images)) {
      return res.status(400).json({ error: "El campo 'images' debe ser un array de URLs" });
    }

    if (!Array.isArray(brands) || brands.length === 0) {
      return res.status(400).json({ error: "El campo 'brands' debe ser un array con al menos una marca" });
    }

    // Crear el producto
    const product = await prisma.product.create({
      data: {
        name,
        category_id,
        quantity_stock,
        oldPrice,
        price,
        rating,
        images,
        description,
        brands: {
          create: brands.map((brandItem) => ({
            name: brandItem.brand, // Nombre de la marca
            models: brandItem.models, // Lista de modelos
          })),
        },
      },
      include: {
        brands: true, // Incluir las marcas en la respuesta
      },
    });

    res.json(product);
  } catch (error) {
    console.error("Error al crear el producto:", error);
    res.status(500).json({ error: "No se pudo crear el producto" });
  }
};


// **Editar un producto por ID**
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      brands, // Array de marcas con modelos
      category_id,
      quantity_stock,
      oldPrice,
      price,
      rating,
      images,
      description,
    } = req.body;

    // Verificar si el producto existe
    const existingProduct = await prisma.product.findUnique({
      where: { id: Number(id) },
      include: { brands: true }, // Incluir las marcas actuales
    });

    if (!existingProduct) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    // Validaciones básicas
    if (!Array.isArray(images)) {
      return res.status(400).json({ error: "El campo 'images' debe ser un array de URLs" });
    }

    if (!Array.isArray(brands) || brands.length === 0) {
      return res.status(400).json({ error: "El campo 'brands' debe ser un array con al menos una marca" });
    }

    // Actualizar producto
    const updatedProduct = await prisma.product.update({
      where: { id: Number(id) },
      data: {
        name,
        category_id,
        quantity_stock,
        oldPrice,
        price,
        rating,
        images,
        description,
        brands: {
          deleteMany: {}, // Elimina todas las marcas asociadas al producto
          create: brands.map((brandItem) => ({
            name: brandItem.brand, // Nuevo nombre de la marca
            models: brandItem.models, // Nuevos modelos de la marca
          })),
        },
      },
      include: {
        brands: true, // Incluir las marcas actualizadas en la respuesta
      },
    });

    res.json(updatedProduct);
  } catch (error) {
    console.error("Error al actualizar el producto:", error);
    res.status(400).json({ error: "No se pudo actualizar el producto" });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { ids } = req.body; // Recibe siempre un array de IDs

    if (!Array.isArray(ids) || ids.length === 0) {
      return res
        .status(400)
        .json({ error: "The 'ids' array is required and cannot be empty" });
    }

    // 🟢 Prisma deleteMany devuelve { count: número }
    const deletedRowCount = await prisma.product.deleteMany({
      where: { id: { in: ids } }, // Asegurarse de usar `in`
    });

    if (deletedRowCount.count === 0) {
      return res.status(404).json({ error: "No product found to delete" });
    }

    return res
      .status(200)
      .json({
        message: `Deleted ${deletedRowCount.count} product successfully`,
      });
  } catch (error) {
    console.error("Error during deleteproduct:", error);
    return res.status(500).json({ error: "Error deleting product" });
  }
};

// Buscar productos por coincidencia en el nombre
const searchProducts = async (req, res) => {
  try {
    const { query } = req.body;

    if (!query) {
      return res
        .status(400)
        .json({ error: "Debes proporcionar un término de búsqueda" });
    }

    // Dividir el término de búsqueda en palabras clave
    const keywords = query.trim().split(/\s+/); // Dividir por espacios

    const products = await prisma.product.findMany({
      where: {
        AND: keywords.map((word) => ({
          name: {
            contains: word,
            mode: "insensitive", // Búsqueda insensible a mayúsculas
          },
        })),
      },
      include: { category: true },
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

const getProductsId = async (req, res) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: Number(req.params.id) },
      include: { category: true }, // Incluir la categoría relacionada
    });

    if (!product)
      return res.status(404).json({ error: "Producto no encontrado" });

    res.json(product); // Devolvemos directamente los productos
  } catch (error) {
    console.error("Error getting products:", error);
    res.status(500).json({ error: "Error al obtener el producto" });
  }
};

const getBrands = async (_req, res) => {
  try {
    const brands = await prisma.product.findMany({
      select: { brand: true },
      distinct: ["brand"],
    });
    res.json(brands);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener las brands" });
  }
};

const getModelsByBrand = async (req, res) => {
  const { brand } = req.body; // 👈 Se obtiene desde req.body
  try {
    const models = await prisma.product.findMany({
      where: { brand },
      select: { model: true },
      distinct: ["model"],
    });
    res.json(models);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los modelos" });
  }
};

const getCategoriesByBrandAndModel = async (req, res) => {
  const { brand, model } = req.body; // 👈 Se obtienen desde req.body
  try {
    const categories = await prisma.product.findMany({
      where: { brand, model },
      select: {
        category: {
          select: { id: true, name: true },
        },
      },
      distinct: ["category_id"],
    });
    res.json(categories.map(item => item.category));
  } catch (error) {
    res.status(500).json({ error: "Error al obtener las categorías" });
  }
};

module.exports = {
  getBrands, getModelsByBrand, getCategoriesByBrandAndModel,
  getProductsId,
  filterProducts,
  searchProducts,
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
};
