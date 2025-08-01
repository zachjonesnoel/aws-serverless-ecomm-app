const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, PutCommand, GetCommand } = require('@aws-sdk/lib-dynamodb');

const client = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocumentClient.from(client);
const newrelic = require('newrelic');

exports.handler = newrelic.setLambdaHandler(async (event) => {
  try {
    const { userId, productId, quantity } = JSON.parse(event.body);

    // Check if product exists
    const productParams = {
      TableName: process.env.PRODUCTS_TABLE,
      Key: {
        id: productId,
      },
    };

    const { Item: product } = await ddbDocClient.send(new GetCommand(productParams));

    if (!product) {
      console.error('Error missing product');
      return {
        statusCode: 404,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({ error: 'Product not found' }),
      };
    }
    newrelic.addCustomSpanAttributes({
      atts: {
        product_id: product.id,
        product_name: product.name,
      }
    })
    // Add to cart
    const cartItem = {
      userId,
      productId,
      quantity: quantity || 1,
      product: {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
      },
      addedAt: new Date().toISOString(),
    };

    const params = {
      TableName: process.env.CART_TABLE,
      Item: cartItem,
    };

    await ddbDocClient.send(new PutCommand(params));
    newrelic.recordCustomEvent('ProductAddedToCard', {
      product_name: product.name,
      product_id: product.id,
    });

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify(cartItem),
    };
  } catch (error) {
    console.error('Error adding item to cart:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ error: 'Failed to add item to cart' }),
    };
  }
});