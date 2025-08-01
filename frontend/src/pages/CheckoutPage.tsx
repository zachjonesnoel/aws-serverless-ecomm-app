import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Button, 
  Grid, 
  Paper, 
  TextField, 
  Box, 
  Stepper, 
  Step, 
  StepLabel,
  Divider,
  CircularProgress,
  Alert
} from '@mui/material';
import { useCart } from '../context/CartContext';
import { processPayment, createOrder } from '../services/api';

const steps = ['Shipping Information', 'Payment Details', 'Review Order'];

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { cartItems, getCartTotal, clearCart } = useCart();
  
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);
  
  const [shippingInfo, setShippingInfo] = useState({
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    email: '',
    phone: ''
  });
  
  const [paymentInfo, setPaymentInfo] = useState({
    cardName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  });

  // For demo purposes, we'll use a mock user ID
  const userId = 'user-123';

  const handleShippingInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShippingInfo({
      ...shippingInfo,
      [e.target.name]: e.target.value
    });
  };

  const handlePaymentInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPaymentInfo({
      ...paymentInfo,
      [e.target.name]: e.target.value
    });
  };

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handlePlaceOrder = async () => {
    try {
      setLoading(true);
      setError(null);

      // In a real app, we would process the payment through the API
      // For demo purposes, we'll simulate a successful payment
      const items = cartItems.map(item => ({
        productId: item.productId,
        quantity: item.quantity
      }));

      // Create order
      const orderData = {
        userId,
        items,
        shippingAddress: {
          firstName: shippingInfo.firstName,
          lastName: shippingInfo.lastName,
          address: shippingInfo.address,
          city: shippingInfo.city,
          state: shippingInfo.state,
          zipCode: shippingInfo.zipCode,
          country: shippingInfo.country,
          email: shippingInfo.email,
          phone: shippingInfo.phone
        },
        paymentInfo: {
          // Don't include actual card details in a real app
          method: 'Credit Card',
          last4: paymentInfo.cardNumber.slice(-4)
        }
      };

      // In a real app, we would call the payment API which triggers the Step Function
      // const paymentResponse = await processPayment({
      //   items,
      //   paymentInfo: {
      //     cardName: paymentInfo.cardName,
      //     cardNumber: paymentInfo.cardNumber,
      //     expiryDate: paymentInfo.expiryDate,
      //     cvv: paymentInfo.cvv
      //   },
      //   total: getCartTotal()
      // });

      // For demo purposes, we'll simulate a successful payment
      const orderResponse = await createOrder(orderData);
      
      setOrderId(orderResponse.data.orderId);
      clearCart();
      handleNext();
    } catch (err) {
      console.error('Error processing order:', err);
      setError('Failed to process your order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const isShippingFormValid = () => {
    return (
      shippingInfo.firstName &&
      shippingInfo.lastName &&
      shippingInfo.address &&
      shippingInfo.city &&
      shippingInfo.state &&
      shippingInfo.zipCode &&
      shippingInfo.country &&
      shippingInfo.email
    );
  };

  const isPaymentFormValid = () => {
    return (
      paymentInfo.cardName &&
      paymentInfo.cardNumber &&
      paymentInfo.expiryDate &&
      paymentInfo.cvv
    );
  };

  const renderShippingForm = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6}>
        <TextField
          required
          fullWidth
          label="First Name"
          name="firstName"
          value={shippingInfo.firstName}
          onChange={handleShippingInfoChange}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          required
          fullWidth
          label="Last Name"
          name="lastName"
          value={shippingInfo.lastName}
          onChange={handleShippingInfoChange}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          required
          fullWidth
          label="Address"
          name="address"
          value={shippingInfo.address}
          onChange={handleShippingInfoChange}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          required
          fullWidth
          label="City"
          name="city"
          value={shippingInfo.city}
          onChange={handleShippingInfoChange}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          required
          fullWidth
          label="State/Province"
          name="state"
          value={shippingInfo.state}
          onChange={handleShippingInfoChange}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          required
          fullWidth
          label="ZIP / Postal code"
          name="zipCode"
          value={shippingInfo.zipCode}
          onChange={handleShippingInfoChange}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          required
          fullWidth
          label="Country"
          name="country"
          value={shippingInfo.country}
          onChange={handleShippingInfoChange}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          required
          fullWidth
          label="Email"
          name="email"
          type="email"
          value={shippingInfo.email}
          onChange={handleShippingInfoChange}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Phone (optional)"
          name="phone"
          value={shippingInfo.phone}
          onChange={handleShippingInfoChange}
        />
      </Grid>
    </Grid>
  );

  const renderPaymentForm = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <TextField
          required
          fullWidth
          label="Name on Card"
          name="cardName"
          value={paymentInfo.cardName}
          onChange={handlePaymentInfoChange}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          required
          fullWidth
          label="Card Number"
          name="cardNumber"
          value={paymentInfo.cardNumber}
          onChange={handlePaymentInfoChange}
          placeholder="1234 5678 9012 3456"
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          required
          fullWidth
          label="Expiry Date"
          name="expiryDate"
          value={paymentInfo.expiryDate}
          onChange={handlePaymentInfoChange}
          placeholder="MM/YY"
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          required
          fullWidth
          label="CVV"
          name="cvv"
          value={paymentInfo.cvv}
          onChange={handlePaymentInfoChange}
          placeholder="123"
        />
      </Grid>
    </Grid>
  );

  const renderOrderSummary = () => (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom>
          Order Summary
        </Typography>
        {cartItems.map((item) => (
          <Box key={item.productId} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography>
              {item.product.name} x {item.quantity}
            </Typography>
            <Typography>
              ${(item.product.price * item.quantity).toFixed(2)}
            </Typography>
          </Box>
        ))}
        <Divider sx={{ my: 2 }} />
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="subtitle1" fontWeight="bold">
            Total
          </Typography>
          <Typography variant="subtitle1" fontWeight="bold">
            ${getCartTotal().toFixed(2)}
          </Typography>
        </Box>
      </Grid>
      
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
          Shipping Address
        </Typography>
        <Typography>
          {shippingInfo.firstName} {shippingInfo.lastName}
        </Typography>
        <Typography>
          {shippingInfo.address}
        </Typography>
        <Typography>
          {shippingInfo.city}, {shippingInfo.state} {shippingInfo.zipCode}
        </Typography>
        <Typography>
          {shippingInfo.country}
        </Typography>
        <Typography>
          {shippingInfo.email}
        </Typography>
        {shippingInfo.phone && (
          <Typography>
            {shippingInfo.phone}
          </Typography>
        )}
      </Grid>
      
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
          Payment Method
        </Typography>
        <Typography>
          Credit Card ending in {paymentInfo.cardNumber.slice(-4)}
        </Typography>
      </Grid>
    </Grid>
  );

  const renderOrderConfirmation = () => (
    <Box sx={{ textAlign: 'center', py: 4 }}>
      <Typography variant="h5" gutterBottom>
        Thank you for your order!
      </Typography>
      <Typography variant="subtitle1">
        Your order number is #{orderId}. We have emailed your order confirmation.
      </Typography>
      <Button 
        variant="contained" 
        color="primary" 
        onClick={() => navigate('/')}
        sx={{ mt: 4 }}
      >
        Continue Shopping
      </Button>
    </Box>
  );

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return renderShippingForm();
      case 1:
        return renderPaymentForm();
      case 2:
        return renderOrderSummary();
      case 3:
        return renderOrderConfirmation();
      default:
        return 'Unknown step';
    }
  };

  if (cartItems.length === 0 && activeStep !== 3) {
    return (
      <Container>
        <Typography variant="h5" gutterBottom>
          Your cart is empty
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={() => navigate('/')}
        >
          Shop Now
        </Button>
      </Container>
    );
  }

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        Checkout
      </Typography>
      
      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      
      <Paper sx={{ p: 3 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        {getStepContent(activeStep)}
        
        {activeStep !== 3 && (
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
            <Button 
              onClick={activeStep === 0 ? () => navigate('/cart') : handleBack}
              disabled={loading}
            >
              {activeStep === 0 ? 'Back to Cart' : 'Back'}
            </Button>
            <Box>
              {activeStep === steps.length - 1 ? (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handlePlaceOrder}
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} /> : 'Place Order'}
                </Button>
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleNext}
                  disabled={(activeStep === 0 && !isShippingFormValid()) || 
                           (activeStep === 1 && !isPaymentFormValid())}
                >
                  Next
                </Button>
              )}
            </Box>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default CheckoutPage;