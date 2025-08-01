import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  IconButton, 
  Badge,
  Menu,
  MenuItem,
  Container
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useCart } from '../context/CartContext';

const categories = [
  { name: 'Electronics', path: '/category/electronics' },
  { name: 'Clothing', path: '/category/clothing' },
  { name: 'Books', path: '/category/books' },
  { name: 'Home', path: '/category/home' },
];

const Header: React.FC = () => {
  const { cartItems } = useCart();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  
  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const cartItemCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  return (
    <AppBar position="static">
      <Container>
        <Toolbar>
          <Typography 
            variant="h6" 
            component={RouterLink} 
            to="/" 
            sx={{ 
              flexGrow: 1, 
              color: 'white', 
              textDecoration: 'none' 
            }}
          >
            Serverless Shop
          </Typography>
          
          <Button 
            color="inherit" 
            onClick={handleMenuOpen}
          >
            Categories
          </Button>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            {categories.map((category) => (
              <MenuItem 
                key={category.name} 
                component={RouterLink} 
                to={category.path}
                onClick={handleMenuClose}
              >
                {category.name}
              </MenuItem>
            ))}
          </Menu>
          
          <Button 
            color="inherit" 
            component={RouterLink} 
            to="/orders"
          >
            Orders
          </Button>
          
          <IconButton 
            color="inherit" 
            component={RouterLink} 
            to="/cart"
          >
            <Badge badgeContent={cartItemCount} color="error">
              <ShoppingCartIcon />
            </Badge>
          </IconButton>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;