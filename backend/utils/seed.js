const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('../models/User');
const Category = require('../models/Category');
const Product = require('../models/Product');

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ecommerce');

    const adminExists = await User.findOne({ email: process.env.SEED_ADMIN_EMAIL || 'admin@example.com' });
    if (!adminExists) {
      const password = await bcrypt.hash(process.env.SEED_ADMIN_PASSWORD || 'Admin@123', 10);
      await User.create({
        name: process.env.SEED_ADMIN_NAME || 'Admin User',
        email: process.env.SEED_ADMIN_EMAIL || 'admin@example.com',
        password,
        role: 'admin',
      });
    }

    const categoryCount = await Category.countDocuments();
    if (categoryCount === 0) {
      const electronics = await Category.create({
        name: 'Electronics',
        slug: 'electronics',
        description: 'Gadgets and electronics',
      });
      const fashion = await Category.create({
        name: 'Fashion',
        slug: 'fashion',
        description: 'Clothing and accessories',
      });
      const home = await Category.create({
        name: 'Home',
        slug: 'home',
        description: 'Home essentials',
      });

      await Product.create([
        {
          name: 'Wireless Headphones',
          slug: 'wireless-headphones',
          description: 'Premium quality wireless headphones with noise cancellation.',
          price: 129.99,
          discountPrice: 99.99,
          category: electronics._id,
          brand: 'SoundMax',
          stock: 18,
          images: ['https://images.unsplash.com/...'],
          rating: 4.8,
          sku: 'WMH-1001',
          featured: true,
          newArrival: true,
          bestSeller: true,
        },
        {
          name: 'Smart Watch',
          slug: 'smart-watch',
          description: 'Track fitness and stay connected with this modern smartwatch.',
          price: 179.99,
          discountPrice: 149.99,
          category: electronics._id,
          brand: 'TechPulse',
          stock: 22,
          images: ['https://images.unsplash.com/...'],
          rating: 4.6,
          sku: 'SW-2001',
          featured: true,
          newArrival: false,
          bestSeller: true,
        },
        {
          name: 'Classic Leather Jacket',
          slug: 'classic-leather-jacket',
          description: 'A timeless leather jacket made for all seasons.',
          price: 220,
          discountPrice: 189,
          category: fashion._id,
          brand: 'UrbanLine',
          stock: 12,
          images: ['https://images.unsplash.com/...'],
          rating: 4.7,
          sku: 'CLJ-3001',
          featured: true,
          newArrival: true,
          bestSeller: false,
        },
        {
          name: 'Modern Desk Lamp',
          slug: 'modern-desk-lamp',
          description: 'Minimal and stylish desk lamp for your workspace.',
          price: 60,
          discountPrice: 45,
          category: home._id,
          brand: 'Luma',
          stock: 31,
          images: ['https://images.unsplash.com/...'],
          rating: 4.4,
          sku: 'DL-4001',
          featured: false,
          newArrival: true,
          bestSeller: false,
        },
      ]);
    }

    console.log('Seed data inserted successfully');
    process.exit(0);
  } catch (error) {
    console.error('Seed failed:', error);
    process.exit(1);
  }
};

seedData();
