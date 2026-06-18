import dotenv from 'dotenv';
import connectDB from './config/db.js';
import User from './models/User.js';
import Category from './models/Category.js';
import Product from './models/Product.js';

dotenv.config();

const categories = [
  { name: 'Electronics', slug: 'electronics', description: 'Gadgets and devices' },
  { name: 'Fashion', slug: 'fashion', description: 'Clothing and accessories' },
  { name: 'Home', slug: 'home', description: 'Home and living' },
  { name: 'Sports', slug: 'sports', description: 'Sports and fitness' },
];

const seed = async () => {
  try {
    await connectDB();

    await User.deleteMany();
    await Category.deleteMany();
    await Product.deleteMany();

    console.log("DB Cleared ✔");

    await User.create([
      {
        name: 'Admin User',
        email: 'admin@shop.com',
        password: 'admin123',
        role: 'admin',
      },
      {
        name: 'John Doe',
        email: 'user@shop.com',
        password: 'user123',
      },
    ]);

    const createdCategories = await Category.insertMany(categories);

    const products = [
      {
        title: 'Apple iPhone 15 Pro',
        description: 'Latest Apple smartphone with A17 Pro chip and titanium body.',
        price: 1299,
        discountPrice: 1199,
        category: createdCategories[0]._id,
        brand: 'Apple',
        stock: 25,
        images: ['https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&auto=format&fit=crop'],
        isFeatured: true,
        isBestSeller: true,
        ratings: 4.9,
        numReviews: 120,
      },
      {
        title: 'MacBook Air M3',
        description: 'Lightweight laptop with powerful performance and long battery life.',
        price: 1499,
        discountPrice: 1399,
        category: createdCategories[0]._id,
        brand: 'Apple',
        stock: 15,
        images: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop'],
        isFeatured: true,
        ratings: 4.8,
        numReviews: 85,
      },
      {
        title: 'Samsung Galaxy Watch 6',
        description: 'Advanced smartwatch with health tracking and GPS.',
        price: 299,
        discountPrice: 249,
        category: createdCategories[0]._id,
        brand: 'Samsung',
        stock: 40,
        images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop'],
        isBestSeller: true,
        ratings: 4.6,
        numReviews: 60,
      },
      {
        title: 'Nike Air Max Sneakers',
        description: 'Comfortable running shoes with modern design.',
        price: 149,
        discountPrice: 129,
        category: createdCategories[1]._id,
        brand: 'Nike',
        stock: 100,
        images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop'],
        isBestSeller: true,
        ratings: 4.7,
        numReviews: 200,
      },
      {
        title: 'Leather Jacket Premium',
        description: 'Stylish leather jacket for modern fashion look.',
        price: 199,
        discountPrice: 159,
        category: createdCategories[1]._id,
        brand: 'Zara',
        stock: 60,
        images: ['https://images.unsplash.com/photo-1520975958225-2c2b2f6f6f6f?w=600&auto=format&fit=crop'],
        isFeatured: true,
        ratings: 4.5,
        numReviews: 90,
      },
      {
        title: 'Modern LED Table Lamp',
        description: 'Minimalist design lamp for home decor.',
        price: 39,
        discountPrice: 29,
        category: createdCategories[2]._id,
        brand: 'HomeGlow',
        stock: 150,
        images: ['https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&auto=format&fit=crop'],
        ratings: 4.4,
        numReviews: 21,
      },
      {
        title: 'Stainless Steel Bottle',
        description: 'Keeps drinks cold and hot for hours.',
        price: 25,
        discountPrice: 19,
        category: createdCategories[2]._id,
        brand: 'HydraFit',
        stock: 200,
        images: ['https://images.unsplash.com/photo-1526401485004-2aa7c4c6f6f6?w=600&auto=format&fit=crop'],
        isBestSeller: true,
        ratings: 4.8,
        numReviews: 95,
      },
      {
        title: 'Gym Dumbbell Set',
        description: 'Perfect home workout dumbbell set.',
        price: 149,
        discountPrice: 119,
        category: createdCategories[3]._id,
        brand: 'FitPro',
        stock: 40,
        images: ['https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600&auto=format&fit=crop'],
        isFeatured: true,
        ratings: 4.6,
        numReviews: 47,
      },
      {
        title: 'Yoga Mat Premium',
        description: 'Non-slip eco friendly yoga mat.',
        price: 35,
        discountPrice: 25,
        category: createdCategories[3]._id,
        brand: 'ZenFlex',
        stock: 90,
        images: ['https://images.unsplash.com/photo-1599447421416-3414500d18a5?w=600&auto=format&fit=crop'],
        ratings: 4.5,
        numReviews: 19,
      }
    ];

    await Product.insertMany(products);

    console.log('Database seeded successfully 🚀');
    console.log('Admin: admin@shop.com / admin123');
    console.log('User: user@shop.com / user123');

    process.exit(0);

  } catch (error) {
    console.error('Seed Error:', error);
    process.exit(1);
  }
};

seed();