const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, UpdateCommand, GetCommand } = require('@aws-sdk/lib-dynamodb');

const client = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocumentClient.from(client);

exports.handler = async (event) => {
  try {
    const { items } = event;
    const updatedItems = [];

    // Update inventory for each item
    for (const item of items) {
      // Get current product
      const getParams = {
        TableName: process.env.PRODUCTS_TABLE,
        Key: {
          id: item.productId,
        },
      };

      const { Item: product } = await ddbDocClient.send(new GetCommand(getParams));
      
      if (!product) {
        console.error(`Product not found: ${item.productId}`);
        continue;
      }

      // Update inventory
      const updateParams = {
        TableName: process.env.PRODUCTS_TABLE,
        Key: {
          id: item.productId,
        },
        UpdateExpression: 'set stock = :newStock',
        ExpressionAttributeValues: {
          ':newStock': product.stock - item.quantity,
        },
        ReturnValues: 'UPDATED_NEW',
      };

      const { Attributes } = await ddbDocClient.send(new UpdateCommand(updateParams));
      
      updatedItems.push({
        productId: item.productId,
        newStock: Attributes.stock,
      });
    }

    return {
      inventoryUpdated: true,
      updatedItems,
      items: event.items,
      paymentId: event.paymentId,
    };
  } catch (error) {
    console.error('Error updating inventory:', error);
    return {
      inventoryUpdated: false,
      error: 'Failed to update inventory',
    };
  }
};