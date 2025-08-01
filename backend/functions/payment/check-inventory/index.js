const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, GetCommand } = require('@aws-sdk/lib-dynamodb');

const client = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocumentClient.from(client);

exports.handler = async (event) => {
  try {
    const { items } = event;
    let inventoryAvailable = true;
    const unavailableItems = [];

    // Check inventory for each item
    for (const item of items) {
      const params = {
        TableName: process.env.PRODUCTS_TABLE,
        Key: {
          id: item.productId,
        },
      };

      const { Item: product } = await ddbDocClient.send(new GetCommand(params));

      if (!product || product.stock < item.quantity) {
        inventoryAvailable = false;
        unavailableItems.push({
          productId: item.productId,
          requested: item.quantity,
          available: product ? product.stock : 0,
        });
      }
    }

    return {
      inventoryAvailable,
      unavailableItems: unavailableItems.length > 0 ? unavailableItems : undefined,
      items,
    };
  } catch (error) {
    console.error('Error checking inventory:', error);
    return {
      inventoryAvailable: false,
      error: 'Failed to check inventory',
    };
  }
};