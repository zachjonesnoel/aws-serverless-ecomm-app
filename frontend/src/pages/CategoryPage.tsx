import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Grid, Typography, CircularProgress, Box } from '@mui/material';
import ProductCard from '../components/ProductCard';
import { getProductsByCategory } from '../services/api';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  rating: number;
  stock: number;
}

const CategoryPage: React.FC = () => {
  const { category } = useParams<{ category: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!category) return;
      
      try {
        setLoading(true);
        const response = await getProductsByCategory(category);
        setProducts(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching products by category:', err);
        setError('Failed to load products. Please try again later.');
        
        // For demo purposes, load mock data if API is not available
        const filteredMockProducts = mockProducts.filter(
          product => product.category.toLowerCase() === category.toLowerCase()
        );
        setProducts(filteredMockProducts);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  const categoryTitle = category ? category.charAt(0).toUpperCase() + category.slice(1) : '';

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        {categoryTitle} Products
      </Typography>
      
      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}
      
      {products.length === 0 ? (
        <Typography variant="body1">
          No products found in this category.
        </Typography>
      ) : (
        <Grid container spacing={4}>
          {products.map((product) => (
            <Grid item key={product.id} xs={12} sm={6} md={4} lg={3}>
              <ProductCard product={product} />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

// Mock data for development/demo purposes
const mockProducts = [
  {
    id: '1',
    name: 'Wireless Headphones',
    description: 'High-quality wireless headphones with noise cancellation',
    price: 99.99,
    image: 'https://via.placeholder.com/300x200?text=Headphones',
    category: 'electronics',
    rating: 4.5,
    stock: 15
  },
  {
    id: '2',
    name: 'Smartphone',
    description: 'Latest model with advanced camera and long battery life',
    price: 699.99,
    image: 'https://via.placeholder.com/300x200?text=Smartphone',
    category: 'electronics',
    rating: 4.8,
    stock: 10
  },
  {
    id: '3',
    name: 'Cotton T-Shirt',
    description: 'Comfortable cotton t-shirt, available in multiple colors',
    price: 19.99,
    image: 'https://via.placeholder.com/300x200?text=T-Shirt',
    category: 'clothing',
    rating: 4.2,
    stock: 50
  },
  {
    id: '4',
    name: 'Coffee Maker',
    description: 'Programmable coffee maker with thermal carafe',
    price: 79.99,
    image: 'https://via.placeholder.com/300x200?text=Coffee+Maker',
    category: 'home',
    rating: 4.0,
    stock: 8
  },
  {
    id: '5',
    name: 'Fitness Tracker',
    description: 'Track your activity, sleep, and more',
    price: 49.99,
    image: 'https://via.placeholder.com/300x200?text=Fitness+Tracker',
    category: 'electronics',
    rating: 4.3,
    stock: 20
  },
  {
    id: '6',
    name: 'Bestselling Novel',
    description: 'The latest bestseller everyone is talking about',
    price: 14.99,
    image: 'https://via.placeholder.com/300x200?text=Book',
    category: 'books',
    rating: 4.7,
    stock: 30
  }
];

export default CategoryPage;