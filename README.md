# 🛒 Ecommerce Project

An ecommerce platform built with **Node.js**, **Express**, and **MySQL**. This platform allows users to register, login, browse products, make purchases, and manage profiles. It includes three types of user roles: **Admin**, **Seller**, and **Buyer**, each with different permissions and functionalities.

## ✨ Features

- 🔒 **User Authentication:**
  - Register and login with JWT-based authentication.
  - Role-based access control (Admin, Seller, Buyer).
  - Secure profile image upload with Multer.
  
- 🛍️ **Product Management:**
  - Admin and sellers can add, edit, or delete products.
  - Support for multiple images per product (up to 3).
  - Product variations (e.g., color, size) supported.
  
- 🛒 **Shopping Cart:**
  - Buyers can add products to the cart and make purchases.
  - Persistent cart (saved in the database).
  
- 🏠 **Address Management:**
  - Buyers can manage their addresses, including adding and deleting them.
  - Supports pinning a location on a map for automatic address filling.
  
- 🛒 **Order Management:**
  - Buyers can place orders for products.
  - Admin and sellers can manage order status.

## 🛠️ Tech Stack

- **Backend:**
  - Node.js
  - Express.js
  - MySQL with Sequelize ORM
  - JWT for authentication
  - Multer for image uploads

- **Frontend (to be developed or integrated):**
  - Can be integrated with React, Vue.js, or any frontend framework.

- **Other Tools:**
  - Docker for containerization 🐳
  - XAMPP for local MySQL server 🐬
  - bcrypt for password hashing 🔐

## 🗂️ Project Structure

📂 /src
├── 📁 config/ # ⚙️ Database configuration and environment variables
├── 📁 controllers/ # 🧠 Application logic for handling requests
├── 📁 models/ # 🗃️ Sequelize models for data representation (User, Product, etc.)
├── 📁 routes/ # 🛤️ API route definitions
├── 📁 middleware/ # 🛡️ Authentication and authorization handlers
├── 📁 utils/ # 🔧 Utility functions used across the app
├── 📂 public/ # 🌐 Public assets such as uploaded images
└── 📄 app.js # 🚀 Main entry point of the application

## 🚀 Getting Started

### Prerequisites
- Node.js (>=14.x)
- MySQL (with Docker or XAMPP)
- Docker (optional, but recommended)

### 🛠️ Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/ecommerce-project.git


