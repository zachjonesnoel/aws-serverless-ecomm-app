import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Container, 
  Grid, 
  Typography, 
  Button, 
  Card, 
  CardMedia, 
  CardContent, 
  Rating, 
  Box, 
  CircularProgress,
  Snackbar,
  Alert,
  TextField
} from '@mui/material';
import { getProductById } from '../services/api';
import { useCart } from '../context/CartContext';

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

const ProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const response = await getProductById(id);
        setProduct(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Failed to load product details. Please try again later.');
        
        // For demo purposes, load mock data if API is not available
        if (mockProducts[id]) {
          setProduct(mockProducts[id]);
          setError(null);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (value > 0 && (!product || value <= product.stock)) {
      setQuantity(value);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleGoToCart = () => {
    navigate('/cart');
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error || !product) {
    return (
      <Container>
        <Typography color="error" variant="h6">
          {error || 'Product not found'}
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={() => navigate('/')}
          sx={{ mt: 2 }}
        >
          Back to Home
        </Button>
      </Container>
    );
  }

  return (
    <Container>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardMedia
              component="img"
              height="400"
              image={product.image || 'https://via.placeholder.com/600x400'}
              alt={product.name}
            />
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Typography variant="h4" component="h1" gutterBottom>
            {product.name}
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Rating value={product.rating || 0} readOnly precision={0.5} />
            <Typography variant="body2" sx={{ ml: 1 }}>
              ({product.rating})
            </Typography>
          </Box>
          
          <Typography variant="h5" color="primary" gutterBottom>
            ${product.price.toFixed(2)}
          </Typography>
          
          <Typography variant="body1" paragraph>
            {product.description}
          </Typography>
          
          <Typography variant="body2" color={product.stock > 0 ? 'success.main' : 'error'} sx={{ mb: 2 }}>
            {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <TextField
              label="Quantity"
              type="number"
              InputProps={{ inputProps: { min: 1, max: product.stock } }}
              value={quantity}
              onChange={handleQuantityChange}
              disabled={product.stock <= 0}
              sx={{ width: '100px', mr: 2 }}
            />
            
            <Button 
              variant="contained" 
              color="primary"
              onClick={handleAddToCart}
              disabled={product.stock <= 0}
              sx={{ mr: 2 }}
            >
              Add to Cart
            </Button>
            
            <Button 
              variant="outlined"
              onClick={() => navigate('/cart')}
            >
              View Cart
            </Button>
          </Box>
          
          <Typography variant="body2" sx={{ mt: 2 }}>
            Category: {product.category}
          </Typography>
        </Grid>
      </Grid>
      
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
          {product.name} added to cart!
          <Button color="inherit" size="small" onClick={handleGoToCart}>
            Go to Cart
          </Button>
        </Alert>
      </Snackbar>
    </Container>
  );
};

// Mock data for development/demo purposes
const mockProducts: Record<string, Product> = {
  '1': {
    id: '1',
    name: 'Wireless Headphones',
    description: 'High-quality wireless headphones with noise cancellation. Features include 20-hour battery life, comfortable ear cups, and crystal clear sound quality. Perfect for travel, work, or everyday use.',
    price: 99.99,
    image: 'https://via.placeholder.com/600x400?text=Headphones',
    category: 'electronics',
    rating: 4.5,
    stock: 15
  },
  '2': {
    id: '2',
    name: 'Smartphone',
    description: 'Latest model with advanced camera and long battery life. Features a 6.1-inch OLED display, 5G connectivity, and an all-day battery. The triple-lens camera system delivers stunning photos even in low light.',
    price: 699.99,
    image: 'https://via.placeholder.com/600x400?text=Smartphone',
    category: 'electronics',
    rating: 4.8,
    stock: 10
  }
};

export default ProductPage;