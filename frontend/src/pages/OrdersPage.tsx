import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Paper, 
  Box, 
  Accordion, 
  AccordionSummary, 
  AccordionDetails,
  Grid,
  Chip,
  CircularProgress,
  Alert
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { getOrders } from '../services/api';

interface OrderItem {
  productId: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    price: number;
    image: string;
  };
}

interface Order {
  orderId: string;
  userId: string;
  items: OrderItem[];
  total: number;
  status: string;
  createdAt: string;
  shippingAddress: {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // For demo purposes, we'll use a mock user ID
  const userId = 'user-123';

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await getOrders(userId);
        setOrders(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError('Failed to load orders. Please try again later.');
        
        // For demo purposes, load mock data if API is not available
        setOrders(mockOrders);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'success';
      case 'shipped':
        return 'info';
      case 'processing':
        return 'warning';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        Your Orders
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      {orders.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6">
            You haven't placed any orders yet.
          </Typography>
        </Paper>
      ) : (
        orders.map((order) => (
          <Accordion key={order.orderId} sx={{ mb: 2 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Grid container alignItems="center" spacing={2}>
                <Grid item xs={12} sm={3}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    Order #{order.orderId.substring(0, 8)}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <Typography variant="body2">
                    {formatDate(order.createdAt)}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <Typography variant="body2">
                    Total: ${order.total.toFixed(2)}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <Chip 
                    label={order.status} 
                    color={getStatusColor(order.status) as any}
                    size="small"
                  />
                </Grid>
              </Grid>
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Items
                </Typography>
                {order.items.map((item) => (
                  <Grid container key={item.productId} sx={{ mb: 1 }}>
                    <Grid item xs={8}>
                      <Typography>
                        {item.product.name} x {item.quantity}
                      </Typography>
                    </Grid>
                    <Grid item xs={4} sx={{ textAlign: 'right' }}>
                      <Typography>
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </Typography>
                    </Grid>
                  </Grid>
                ))}
              </Box>
              
              <Box>
                <Typography variant="h6" gutterBottom>
                  Shipping Address
                </Typography>
                <Typography>
                  {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                </Typography>
                <Typography>
                  {order.shippingAddress.address}
                </Typography>
                <Typography>
                  {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                </Typography>
                <Typography>
                  {order.shippingAddress.country}
                </Typography>
              </Box>
            </AccordionDetails>
          </Accordion>
        ))
      )}
    </Container>
  );
};

// Mock data for development/demo purposes
const mockOrders = [
  {
    orderId: '8f7d6e5c-4b3a-2c1d-0e9f-8a7b6c5d4e3f',
    userId: 'user-123',
    items: [
      {
        productId: '1',
        quantity: 1,
        product: {
          id: '1',
          name: 'Wireless Headphones',
          price: 99.99,
          image: 'https://via.placeholder.com/300x200?text=Headphones'
        }
      },
      {
        productId: '3',
        quantity: 2,
        product: {
          id: '3',
          name: 'Cotton T-Shirt',
          price: 19.99,
          image: 'https://via.placeholder.com/300x200?text=T-Shirt'
        }
      }
    ],
    total: 139.97,
    status: 'Delivered',
    createdAt: '2023-06-15T10:30:00Z',
    shippingAddress: {
      firstName: 'John',
      lastName: 'Doe',
      address: '123 Main St',
      city: 'Anytown',
      state: 'CA',
      zipCode: '12345',
      country: 'USA'
    }
  },
  {
    orderId: '1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p',
    userId: 'user-123',
    items: [
      {
        productId: '2',
        quantity: 1,
        product: {
          id: '2',
          name: 'Smartphone',
          price: 699.99,
          image: 'https://via.placeholder.com/300x200?text=Smartphone'
        }
      }
    ],
    total: 699.99,
    status: 'Processing',
    createdAt: '2023-06-20T14:45:00Z',
    shippingAddress: {
      firstName: 'John',
      lastName: 'Doe',
      address: '123 Main St',
      city: 'Anytown',
      state: 'CA',
      zipCode: '12345',
      country: 'USA'
    }
  }
];

export default OrdersPage;