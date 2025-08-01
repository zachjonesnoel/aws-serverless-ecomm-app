import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { 
  Card, 
  CardActions, 
  CardContent, 
  CardMedia, 
  Button, 
  Typography, 
  Rating 
} from '@mui/material';
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

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(product, 1);
  };

  return (
    <Card sx={{ maxWidth: 345, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardMedia
        component="img"
        height="140"
        image={product.image || 'https://via.placeholder.com/300x200'}
        alt={product.name}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h6" component="div">
          {product.name}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          {product.description?.substring(0, 100)}
          {product.description?.length > 100 ? '...' : ''}
        </Typography>
        <Typography variant="h6" color="primary" sx={{ mb: 1 }}>
          ${product.price.toFixed(2)}
        </Typography>
        <Rating value={product.rating || 0} readOnly precision={0.5} />
      </CardContent>
      <CardActions>
        <Button 
          size="small" 
          component={RouterLink} 
          to={`/product/${product.id}`}
        >
          View Details
        </Button>
        <Button 
          size="small" 
          color="primary" 
          onClick={handleAddToCart}
          disabled={product.stock <= 0}
        >
          {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
        </Button>
      </CardActions>
    </Card>
  );
};

export default ProductCard;