import { Product } from '../types/Product';

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Wireless Headphones',
    description: 'High-quality wireless headphones with noise cancellation. Features include 20-hour battery life, comfortable ear cups, and crystal clear sound quality.',
    price: 99.99,
    image: 'https://via.placeholder.com/600x400?text=Headphones',
    category: 'Electronics',
    rating: 4.5,
    stock: 15
  },
  {
    id: '2',
    name: 'Smartphone',
    description: 'Latest model with advanced camera and long battery life. Features a 6.1-inch OLED display, 5G connectivity, and an all-day battery.',
    price: 699.99,
    image: 'https://via.placeholder.com/600x400?text=Smartphone',
    category: 'Electronics',
    rating: 4.8,
    stock: 10
  },
  {
    id: '3',
    name: 'Coffee Maker',
    description: 'Programmable coffee maker with built-in grinder and timer. Brew the perfect cup every morning with customizable strength settings.',
    price: 79.95,
    image: 'https://via.placeholder.com/600x400?text=Coffee+Maker',
    category: 'Home Appliances',
    rating: 4.2,
    stock: 8
  },
  {
    id: '4',
    name: 'Running Shoes',
    description: 'Lightweight and comfortable running shoes with enhanced cushioning. Designed for long-distance running with breathable mesh upper.',
    price: 129.50,
    image: 'https://via.placeholder.com/600x400?text=Running+Shoes',
    category: 'Sports',
    rating: 4.7,
    stock: 20
  },
  {
    id: '5',
    name: 'Laptop',
    description: 'Powerful laptop with 16GB RAM, 512GB SSD, and dedicated graphics card. Perfect for work, gaming, and creative tasks.',
    price: 1299.99,
    image: 'https://via.placeholder.com/600x400?text=Laptop',
    category: 'Electronics',
    rating: 4.9,
    stock: 5
  },
  {
    id: '6',
    name: 'Fitness Tracker',
    description: 'Track your steps, heart rate, sleep quality, and more. Water-resistant design with a 7-day battery life.',
    price: 59.99,
    image: 'https://via.placeholder.com/600x400?text=Fitness+Tracker',
    category: 'Electronics',
    rating: 4.3,
    stock: 12
  },
  {
    id: '7',
    name: 'Blender',
    description: 'High-speed blender with multiple settings for smoothies, soups, and more. Includes to-go cups for convenience.',
    price: 49.95,
    image: 'https://via.placeholder.com/600x400?text=Blender',
    category: 'Home Appliances',
    rating: 4.0,
    stock: 9
  },
  {
    id: '8',
    name: 'Backpack',
    description: 'Durable backpack with laptop compartment and multiple pockets. Water-resistant material and comfortable straps.',
    price: 45.00,
    image: 'https://via.placeholder.com/600x400?text=Backpack',
    category: 'Fashion',
    rating: 4.6,
    stock: 25
  },
  {
    id: '9',
    name: 'Smart Watch',
    description: 'Track fitness, receive notifications, and more with this versatile smart watch. Features include heart rate monitoring and GPS.',
    price: 199.99,
    image: 'https://via.placeholder.com/600x400?text=Smart+Watch',
    category: 'Electronics',
    rating: 4.7,
    stock: 7
  },
  {
    id: '10',
    name: 'Yoga Mat',
    description: 'Non-slip yoga mat with proper cushioning for comfort during workouts. Includes carrying strap for easy transport.',
    price: 29.99,
    image: 'https://via.placeholder.com/600x400?text=Yoga+Mat',
    category: 'Sports',
    rating: 4.4,
    stock: 30
  },
  {
    id: '11',
    name: 'Desk Lamp',
    description: 'Adjustable LED desk lamp with multiple brightness levels and color temperatures. Energy-efficient with touch controls.',
    price: 34.50,
    image: 'https://via.placeholder.com/600x400?text=Desk+Lamp',
    category: 'Home',
    rating: 4.1,
    stock: 18
  },
  {
    id: '12',
    name: 'Bluetooth Speaker',
    description: 'Portable Bluetooth speaker with 360-degree sound and 12-hour battery life. Waterproof design makes it perfect for outdoor use.',
    price: 89.99,
    image: 'https://via.placeholder.com/600x400?text=Bluetooth+Speaker',
    category: 'Electronics',
    rating: 4.5,
    stock: 14
  },
  {
    id: '13',
    name: 'Digital Camera',
    description: '24MP digital camera with 4K video recording capabilities. Includes various shooting modes and wireless connectivity.',
    price: 449.99,
    image: 'https://via.placeholder.com/600x400?text=Digital+Camera',
    category: 'Electronics',
    rating: 4.8,
    stock: 6
  },
  {
    id: '14',
    name: 'Air Fryer',
    description: 'Cook healthier meals with this 5.5-quart air fryer. Features digital controls and 8 preset cooking programs.',
    price: 119.95,
    image: 'https://via.placeholder.com/600x400?text=Air+Fryer',
    category: 'Home Appliances',
    rating: 4.6,
    stock: 11
  },
  {
    id: '15',
    name: 'Gaming Console',
    description: 'Next-generation gaming console with 1TB storage, 4K gaming capabilities, and access to an extensive game library.',
    price: 499.99,
    image: 'https://via.placeholder.com/600x400?text=Gaming+Console',
    category: 'Electronics',
    rating: 4.9,
    stock: 3
  }
];

// Helper function to get a product by ID
export const getProductById = (id: string): Product | undefined => {
  return mockProducts.find(product => product.id === id);
};

// Convert to a record for quick lookup
export const mockProductsRecord: Record<string, Product> = mockProducts.reduce(
  (acc, product) => ({
    ...acc,
    [product.id]: product
  }), 
  {}
);