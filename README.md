# Serverless E-commerce Application

A full-fledged serverless e-commerce application built using AWS services including Lambda, API Gateway, DynamoDB, Step Functions, and CDK.

## Architecture Overview

The application uses the following AWS services:
- AWS Lambda for serverless compute
- Amazon API Gateway for REST API endpoints
- Amazon DynamoDB for product and cart data storage
- AWS Step Functions for payment workflow orchestration
- AWS CDK for infrastructure as code

## Project Structure

```
.
├── backend/
│   ├── bin/                # CDK app entry point
│   ├── functions/          # Lambda functions
│   │   ├── products/       # Product-related functions
│   │   ├── cart/           # Cart-related functions
│   │   ├── orders/         # Order-related functions
│   │   └── payment/        # Payment-related functions
│   └── lib/                # CDK stack definition
├── frontend/
│   ├── public/             # Static assets
│   └── src/                # React application source
│       ├── components/     # Reusable UI components
│       ├── context/        # React context for state management
│       ├── pages/          # Page components
│       └── services/       # API services
└── cdk.out/                # CDK output
```

## Features

- Product listing and categorization
- Shopping cart management
- Secure payment processing with Step Functions
- Order management
- Responsive React frontend (WIP)

## Setup and Deployment

### Prerequisites

- Node.js (v14 or later)
- AWS CLI configured with appropriate credentials
- AWS CDK installed globally (`npm install -g aws-cdk`)

### Backend Deployment

1. Install dependencies:
```bash
npm install
```

2. Bootstrap CDK (first time only):
```bash
cdk bootstrap
```

3. Deploy the CDK stack:
```bash
cdk deploy --context nrLicenseKey=<YOUR NEW RELIC LICENSE KEY> --context nrAccountID=<YOUR NEW RELIC ACCOUNT ID>
```

4. Note the API Gateway URL from the output.

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file with your API Gateway URL:
```
REACT_APP_API_URL=https://your-api-gateway-url.execute-api.region.amazonaws.com/prod
```

4. Start the development server:
```bash
npm start
```

## Testing

For local testing of the API, you can use tools like Postman or curl to make requests to the deployed API Gateway endpoints.

## Step Functions Workflow

The payment processing workflow uses AWS Step Functions to orchestrate the following steps:
1. Check inventory availability
2. Process payment
3. Update inventory
4. Create order

This ensures that orders are only created when inventory is available and payment is successful.

## License

MIT License