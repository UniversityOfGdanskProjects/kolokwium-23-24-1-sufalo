const express = require('express');
const mongoose = require('mongoose');
const Product = require('./models/Product');
const Order = require('./models/Order');

const app = express();
const port = 3000;

mongoose.connect('mongodb://localhost:27017/ecommerce', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
  addSampleProducts().then(() => {
    console.log('Sample products added');
  }).catch((error) => {
    console.error('Error adding sample products', error);
  });
}).catch((error) => {
  console.error('Error connecting to MongoDB', error);
});

app.use(express.json());

// w razie jak baza nie działa to dodawanie jakichś wpisów
const addSampleProducts = async () => {
  const sampleProducts = [
    {
      product_id: '5280a713-f202-44a0-a758-35de6896fd31',
      product_name: 'PowerMax 5000',
      category: 'pet supplies',
      price: 651.31,
      in_stock: true
    },
    {
      product_id: '6a79a736-1d72-4b8c-b8f2-b438b4f9277d',
      product_name: 'Eco-Friendly Water Bottle',
      category: 'home goods',
      price: 15.99,
      in_stock: true
    }
  ];

  for (const product of sampleProducts) {
    const existingProduct = await Product.findOne({ product_id: product.product_id });
    if (!existingProduct) {
      await new Product(product).save();
    }
  }
};

app.get('/api/products/:id', async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findOne({ product_id: productId });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

app.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

app.post('/api/orders', async (req, res) => {
  try {
    const newOrder = new Order(req.body);
    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

app.put('/api/products/:id', async (req, res) => {
  try {
    const productId = req.params.id;
    const updatedProductData = req.body;

    const updatedProduct = await Product.findOneAndUpdate(
      { product_id: productId },
      updatedProductData,
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

app.get('/api/orders/statistics', async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const averageOrderValue = await Order.aggregate([
      { $group: { _id: null, total: { $avg: "$quantity" } } }
    ]);

    const orderStatusCounts = await Order.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);

    const statistics = {
      totalOrders: totalOrders,
      averageOrderValue: averageOrderValue.length > 0 ? averageOrderValue[0].total : 0,
      orderStatusCounts: orderStatusCounts
    };

    res.json(statistics);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port 3000.`);
});
