import React from 'react';
import { Box, Container, Typography, Link } from '@mui/material';

const Footer: React.FC = () => {
  return (
    <Box 
      component="footer" 
      sx={{ 
        py: 3, 
        mt: 'auto', 
        backgroundColor: (theme) => theme.palette.grey[200] 
      }}
    >
      <Container maxWidth="lg">
        <Typography variant="body2" color="text.secondary" align="center">
          {'© '}
          {new Date().getFullYear()}
          {' '}
          <Link color="inherit" href="/">
            Serverless E-commerce
          </Link>
          {' - Built with AWS Serverless Services'}
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;