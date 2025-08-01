const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, PutCommand, QueryCommand } = require('@aws-sdk/lib-dynamodb');
const { v4: uuidv4 } = require('uuid');

const client = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocumentClient.from(client);

exports.handler = async (event) => {
  try {
    const { userId, shippingAddress, paymentInfo } = JSON.parse(event.body);
    
    if (!userId) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({ error: 'userId is required' }),
      };
    }

    // Get cart items
    const cartParams = {
      TableName: process.env.CART_TABLE,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId,
      },
    };

    const { Items: cartItems } = await ddbDocClient.send(new QueryCommand(cartParams));

    if (!cartItems || cartItems.length === 0) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({ error: 'Cart is empty' }),
      };
    }

    // Calculate total
    const total = cartItems.reduce((sum, item) => {
      return sum + (item.product.price * item.quantity);
    }, 0);

    // Create order
    const orderId = uuidv4();
    const order = {
      orderId,
      userId,
      items: cartItems,
      total,
      shippingAddress,
      paymentInfo,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    const orderParams = {
      TableName: process.env.ORDERS_TABLE,
      Item: order,
    };

    await ddbDocClient.send(new PutCommand(orderParams));

    return {
      statusCode: 201,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ 
        orderId,
        orderCreated: true,
        message: 'Order created successfully' 
      }),
    };
  } catch (error) {
    console.error('Error creating order:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ 
        orderCreated: false,
        error: 'Failed to create order' 
      }),
    };
  }
};