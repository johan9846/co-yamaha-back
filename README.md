# 🛍️ Backend de E-Commerce Node.js, Express, Postgres ORM prisma


## 🚀 Características

- **CRUD de Productos y Categorías**: Controladores diseñados para la creación, lectura, actualización y eliminación de productos y categorías.  

---

## 🛠️ Tecnologías Utilizadas  

### **Backend**  
- **Node.js**: Servidor backend eficiente y escalable.  
- **Express.js**: Framework para la gestión de rutas y controladores.  

### **Base de Datos**  
- **PostgreSQL**: Base de datos relacional que garantiza la integridad y seguridad de los datos.  
- **Prisma ORM**: Facilita la gestión de la base de datos y simplifica la interacción con los datos.  

### **Funcionalidades del Backend**  
- **CRUD de Productos y Categorías**: Controladores diseñados para la creación, lectura, actualización y eliminación de productos y categorías.  
    

---

## 📌 Requisitos y Configuración

### **1️⃣ Backend (Obligatorio)**


Para configurarlo, sigue estos pasos:

1. **Clonar el repositorio**

   ```bash
   git clone https://github.com/johan9846/co-yamaha-back.git
   cd co-yamaha-back
   ```

3. **Variables de entorno**
   crear .env y poner

   ```bash
   DATABASE_URL="postgresql://johan22:yamaha@localhost:5433/yamaha_db?schema=public"
   DB_USER=johan22
   DB_NAME=yamaha_db
   DB_PASSWORD=yamaha
   ```

2. **Instalar dependencias**

   ```bash
   npm install
   ```

3. **Levantar la base de datos en Docker**

   ```bash
   docker compose up -d
   ```

4. **Ejecutar la semilla de datos**

   ```bash
   node src/seed/loadDataDb.js
   ```

5. **Levantar el backend**

   ```bash
   npm run dev
   ```

---




