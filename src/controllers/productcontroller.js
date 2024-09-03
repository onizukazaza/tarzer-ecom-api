const Product = require('../models/product');


exports.addProduct = async (req, res) => {
    const { name, price, description } = req.body;
    

    if (!req.user || !req.user.id) {
        return res.status(400).json({ message: "User not authenticated" });
    }


    if (req.user.role !== 'seller' && req.user.role !== 'admin') {
        return res.status(403).json({ message: "Access denied: Insufficient role" });
    }

    const sellerId = req.user.id;

    try {
        const product = await Product.create({ name, price, description, sellerId });
        res.status(201).json(product);
    } catch (err) {
        console.error("Error adding product:", err);
        res.status(500).json({ message: "Server error while adding product" });
    }
};


// ลบสินค้า
exports.deleteProduct = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedRows = await Product.destroy({ where: { id } });
        if (deletedRows === 0) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json({ message: "Product deleted successfully" }); 
    } catch (err) {
        console.error("Error deleting product:", err);
        res.status(500).json({ message: "Server error while deleting product" });
    }
};

// ดึงสินค้าทั้งหมด
exports.getAllProducts = async (req, res) => { 
    try {
        const products = await Product.findAll();
        res.status(200).json(products);
    } catch (err) {
        console.error("Error fetching products:", err);
        res.status(500).json({ message: "Server error while fetching products" });
    }
};

// ดึงสินค้าตาม ID
exports.getProductById = async (req, res) => {
    const { id } = req.params;

    try {
        const product = await Product.findByPk(id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json(product);
    } catch (err) {
        console.error("Error fetching product:", err);
        res.status(500).json({ message: "Server error while fetching product" });
    }
};
