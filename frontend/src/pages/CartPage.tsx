import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Button, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia, 
  IconButton, 
  Box,
  Divider,
  TextField
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useCart } from '../context/CartContext';

const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const { cartItems, removeFromCart, addToCart, getCartTotal } = useCart();

  const handleQuantityChange = (productId: string, product: any, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
    } else {
      // Remove and re-add with new quantity
      removeFromCart(productId);
      addToCart(product, newQuantity);
    }
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        Your Shopping Cart
      </Typography>

      {cartItems.length === 0 ? (
        <Box sx={{ my: 4, textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>
            Your cart is empty
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={() => navigate('/')}
            sx={{ mt: 2 }}
          >
            Continue Shopping
          </Button>
        </Box>
      ) : (
        <>
          {cartItems.map((item) => (
            <Card key={item.productId} sx={{ mb: 2 }}>
              <Grid container>
                <Grid item xs={12} sm={3}>
                  <CardMedia
                    component="img"
                    height="140"
                    image={item.product.image || 'https://via.placeholder.com/300x200'}
                    alt={item.product.name}
                    sx={{ objectFit: 'contain', p: 1 }}
                  />
                </Grid>
                <Grid item xs={12} sm={9}>
                  <CardContent>
                    <Grid container alignItems="center">
                      <Grid item xs={12} sm={6}>
                        <Typography variant="h6" component="div">
                          {item.product.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          ${item.product.price.toFixed(2)} each
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={3} sx={{ display: 'flex', alignItems: 'center' }}>
                        <TextField
                          label="Quantity"
                          type="number"
                          size="small"
                          value={item.quantity}
                          onChange={(e) => {
                            const newQuantity = parseInt(e.target.value);
                            if (!isNaN(newQuantity)) {
                              handleQuantityChange(item.productId, item.product, newQuantity);
                            }
                          }}
                          InputProps={{ inputProps: { min: 1 } }}
                          sx={{ width: '80px' }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={2} sx={{ textAlign: 'right' }}>
                        <Typography variant="subtitle1" fontWeight="bold">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={1} sx={{ textAlign: 'right' }}>
                        <IconButton 
                          color="error" 
                          onClick={() => removeFromCart(item.productId)}
                          aria-label="delete"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Grid>
              </Grid>
            </Card>
          ))}

          <Box sx={{ mt: 4, mb: 2 }}>
            <Divider />
            <Grid container justifyContent="flex-end" sx={{ mt: 2 }}>
              <Grid item xs={12} sm={6} md={4}>
                <Typography variant="subtitle1">
                  Subtotal ({cartItems.reduce((count, item) => count + item.quantity, 0)} items):
                </Typography>
                <Typography variant="h5" color="primary" fontWeight="bold">
                  ${getCartTotal().toFixed(2)}
                </Typography>
              </Grid>
            </Grid>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
            <Button 
              variant="outlined" 
              onClick={() => navigate('/')}
            >
              Continue Shopping
            </Button>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={handleCheckout}
              disabled={cartItems.length === 0}
            >
              Proceed to Checkout
            </Button>
          </Box>
        </>
      )}
    </Container>
  );
};

export default CartPage;