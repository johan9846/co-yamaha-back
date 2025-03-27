const prisma = require("../config/database");

const dataCategory = [
  {
    name: "Partes de Motor",
  },
  {
    name: "Partes Eléctricas",
  },
  {
    name: "Kit de Arrastre",
  },
  {
    name: "Llantas",
  },
];

const dataProduct = [
  {
    category_id: 4,
    name: "Lantas pirelli diablo rosso",
    oldPrice: 600000,
    price: 500000,
    rating: 5,
    images: [
      "https://res.cloudinary.com/dsd0w2l0x/image/upload/v1742914073/hypl2tzcm0914sdpd5bb.jpg",
      "https://res.cloudinary.com/dsd0w2l0x/image/upload/v1742914073/n4zqzuef0mirvy8jmqgh.jpg",
    ],
    description: "llantas diablo rosso",
    createdAt: "2025-03-25T19:47:55.480Z",
    quantity_stock: 20,
    brands: [
      {
        brand: "YAMAHA",
        models: ["FZ-250", "crypton"],
      },
      {
        brand: "SUZUKI",
        models: ["viva-r", "gixxer"],
      },
    ],
  },
  {
    category_id: 2,
    name: "Direccional",
    oldPrice: 80000,
    price: 70000,
    rating: 4,
    images: [
      "https://res.cloudinary.com/dsd0w2l0x/image/upload/v1742914214/ifxlonmujp2uyjdej4qk.webp",
      "https://res.cloudinary.com/dsd0w2l0x/image/upload/v1742914214/edr3qksootos8h5mhzof.webp",
    ],
    description: "direccional",
    createdAt: "2025-03-25T19:50:17.177Z",
    quantity_stock: 10,
    brands: [
      {
        brand: "YAMAHA",
        models: ["Dt-175", "Dt-125"],
      },
      {
        brand: "SUZUKI",
        models: ["TTR-125"],
      },
    ],
  },
  {
    category_id: 1,
    name: "Carburador",
    oldPrice: 250000,
    price: 230000,
    rating: 4,
    images: [
      "https://res.cloudinary.com/dsd0w2l0x/image/upload/v1742914139/czynphgnqitaltzuzgfi.webp",
      "https://res.cloudinary.com/dsd0w2l0x/image/upload/v1742914139/aeqhht2lfkehsrylauj5.webp",
    ],
    description: "carburador",
    createdAt: "2025-03-25T19:49:02.094Z",
    quantity_stock: 10,
    brands: [
      {
        brand: "YAMAHA",
        models: [ "unico", "crypton"],
      },
    ],
  },
  {
    category_id: 3,
    name: "Kit de arrastre",
    oldPrice: 180000,
    price: 170000,
    rating: 5.0,
    images: [
      "https://res.cloudinary.com/dsd0w2l0x/image/upload/v1742914404/xl45beohqrwxfxbi9gwh.png",
      "https://res.cloudinary.com/dsd0w2l0x/image/upload/v1742914403/hxgdasckg68yf9zmtohu.webp",
    ],
    description: "KIT DE ARRASTRE MARCA VITREX",
    createdAt: "2025-03-25T19:53:26.473Z",
    quantity_stock: 5,
    brands: [
      {
        brand: "HONDA",
        models: ["wave", "cb-110"],
      },
    ],
  },
  {
    category_id: 1,
    name: "Filtro",
    oldPrice: 50000,
    price: 45000,
    rating: 2,
    images: [
      "https://res.cloudinary.com/dsd0w2l0x/image/upload/v1742914305/zgr0ynwjnlho8mbpydkt.webp",
      "https://res.cloudinary.com/dsd0w2l0x/image/upload/v1742914305/wncry7bwmxpdnqrvgrnq.webp",
    ],
    description: "Filtro de aceite",
    createdAt: "2025-03-25T19:51:47.715Z",
    quantity_stock: 50,
    brands: [
      {
        brand: "YAMAHA",
        models: ["fz-250"],
      },
    ],
  },
];

const loadDataDb = async () => {
  await prisma.category.deleteMany();
  await prisma.product.deleteMany();
  await prisma.brand.deleteMany();

  await Promise.all(
    dataCategory.map((category) => {
      return prisma.category.create({ data: category });
    })
  );

  await Promise.all(
    dataProduct.map(async (product) => {
      return prisma.product.create({
        data: {
          ...product,
          brands: {
            create:
              product.brands?.map((brandItem) => ({
                name: brandItem.brand, // Nombre de la marca
                models: brandItem.models, // Lista de modelos
              })) || [], // Si no hay marcas, pasar un array vacío
          },
        },
        include: {
          brands: true, // Incluir las marcas en la respuesta
        },
      });
    })
  );
};

loadDataDb();
