import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as sfn from 'aws-cdk-lib/aws-stepfunctions';
import * as tasks from 'aws-cdk-lib/aws-stepfunctions-tasks';
import * as path from 'path';

export class EcommerceStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // DynamoDB Tables
    const productsTable = new dynamodb.Table(this, 'ProductsTable', {
      partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY, // For demo purposes only
    });

    productsTable.addGlobalSecondaryIndex({
      indexName: 'category-index',
      partitionKey: { name: 'category', type: dynamodb.AttributeType.STRING },
      projectionType: dynamodb.ProjectionType.ALL
    });

    const cartTable = new dynamodb.Table(this, 'CartTable', {
      partitionKey: { name: 'userId', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'productId', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY, // For demo purposes only
    });

    const ordersTable = new dynamodb.Table(this, 'OrdersTable', {
      partitionKey: { name: 'orderId', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY, // For demo purposes only
    });

    // Lambda Functions
    const nrLicenseKey = this.node.tryGetContext('nrLicenseKey') || 'MISSING_LICENSE_KEY';
    const nrAccountID = this.node.tryGetContext('nrAccountID') || 'MISSING_ACCOUNT_ID';
    const nrLayerArn = this.node.tryGetContext('adotLayerVersion') || 'arn:aws:lambda:us-east-1:451483290750:layer:NewRelicNodeJS22X:22';
    let NRLayer = lambda.LayerVersion.fromLayerVersionArn(
      this,
      'NRLayer',
      nrLayerArn
    )
    const lambdaEnvironment = {
      PRODUCTS_TABLE: productsTable.tableName,
      CART_TABLE: cartTable.tableName,
      ORDERS_TABLE: ordersTable.tableName,
      NEW_RELIC_ACCOUNT_ID: nrAccountID,
      NEW_RELIC_LAMBDA_HANDLER: 'index.handler',
      NEW_RELIC_LICENSE_KEY: nrLicenseKey,
      NEW_RELIC_EXTENSION_LOG_LEVEL: "DEBUG",
      NEW_RELIC_EXTENSION_SEND_EXTENSION_LOGS: "true",
      NEW_RELIC_EXTENSION_SEND_FUNCTION_LOGS: "true",
      NEW_RELIC_EXTENSION_LOGS_ENABLED: "true",
      NEW_RELIC_COLLECT_TRACE_ID: "true",
      NEW_RELIC_DISTRIBUTED_TRACING_ENABLED: "true",
    };

    // Products Lambda Functions
    const getProductsFunction = new lambda.Function(this, 'GetProductsFunction', {
      runtime: lambda.Runtime.NODEJS_22_X,
      handler: "newrelic-lambda-wrapper.handler",
      code: lambda.Code.fromAsset(path.join(__dirname, '../functions/products/get-products')),
      environment: lambdaEnvironment,
      tracing: lambda.Tracing.ACTIVE,
      layers: [NRLayer],
      memorySize: 256,
      timeout: cdk.Duration.seconds(15),
    });

    const getProductByIdFunction = new lambda.Function(this, 'GetProductByIdFunction', {
      runtime: lambda.Runtime.NODEJS_22_X,
      handler: "newrelic-lambda-wrapper.handler",
      code: lambda.Code.fromAsset(path.join(__dirname, '../functions/products/get-product-by-id')),
      environment: lambdaEnvironment,
      tracing: lambda.Tracing.ACTIVE,
      layers: [NRLayer],
      memorySize: 256,
      timeout: cdk.Duration.seconds(15),
    });

    const getProductsByCategoryFunction = new lambda.Function(this, 'GetProductsByCategoryFunction', {
      runtime: lambda.Runtime.NODEJS_22_X,
      handler: "newrelic-lambda-wrapper.handler",
      code: lambda.Code.fromAsset(path.join(__dirname, '../functions/products/get-products-by-category')),
      environment: lambdaEnvironment,
      tracing: lambda.Tracing.ACTIVE,
      layers: [NRLayer],
      memorySize: 256,
      timeout: cdk.Duration.seconds(15),
    });

    // Cart Lambda Functions
    const addToCartFunction = new lambda.Function(this, 'AddToCartFunction', {
      runtime: lambda.Runtime.NODEJS_22_X,
      handler: "newrelic-lambda-wrapper.handler",
      code: lambda.Code.fromAsset(path.join(__dirname, '../functions/cart/add-to-cart')),
      environment: lambdaEnvironment,
      tracing: lambda.Tracing.ACTIVE,
      layers: [NRLayer],
      memorySize: 512,
      timeout: cdk.Duration.seconds(30),
    });

    const getCartFunction = new lambda.Function(this, 'GetCartFunction', {
      runtime: lambda.Runtime.NODEJS_22_X,
      handler: "newrelic-lambda-wrapper.handler",
      code: lambda.Code.fromAsset(path.join(__dirname, '../functions/cart/get-cart')),
      environment: lambdaEnvironment,
      tracing: lambda.Tracing.ACTIVE,
      layers: [NRLayer],
      memorySize: 256,
      timeout: cdk.Duration.seconds(15),
    });

    const removeFromCartFunction = new lambda.Function(this, 'RemoveFromCartFunction', {
      runtime: lambda.Runtime.NODEJS_22_X,
      handler: "newrelic-lambda-wrapper.handler",
      code: lambda.Code.fromAsset(path.join(__dirname, '../functions/cart/remove-from-cart')),
      environment: lambdaEnvironment,
      tracing: lambda.Tracing.ACTIVE,
      layers: [NRLayer],
      memorySize: 256,
      timeout: cdk.Duration.seconds(15),
    });

    // Order Lambda Functions
    const createOrderFunction = new lambda.Function(this, 'CreateOrderFunction', {
      runtime: lambda.Runtime.NODEJS_22_X,
      handler: "newrelic-lambda-wrapper.handler",
      code: lambda.Code.fromAsset(path.join(__dirname, '../functions/orders/create-order')),
      environment: lambdaEnvironment,
      tracing: lambda.Tracing.ACTIVE,
      layers: [NRLayer],
      memorySize: 256,
      timeout: cdk.Duration.seconds(15),
    });

    const getOrdersFunction = new lambda.Function(this, 'GetOrdersFunction', {
      runtime: lambda.Runtime.NODEJS_22_X,
      handler: "newrelic-lambda-wrapper.handler",
      code: lambda.Code.fromAsset(path.join(__dirname, '../functions/orders/get-orders')),
      environment: lambdaEnvironment,
      tracing: lambda.Tracing.ACTIVE,
      layers: [NRLayer],
      memorySize: 256,
      timeout: cdk.Duration.seconds(15),
    });

    // Payment Lambda Functions
    const processPaymentFunction = new lambda.Function(this, 'ProcessPaymentFunction', {
      runtime: lambda.Runtime.NODEJS_22_X,
      handler: "newrelic-lambda-wrapper.handler",
      code: lambda.Code.fromAsset(path.join(__dirname, '../functions/payment/process-payment')),
      environment: lambdaEnvironment,
      tracing: lambda.Tracing.ACTIVE,
      layers: [NRLayer],
      memorySize: 256,
      timeout: cdk.Duration.seconds(15),
    });

    const checkInventoryFunction = new lambda.Function(this, 'CheckInventoryFunction', {
      runtime: lambda.Runtime.NODEJS_22_X,
      handler: "newrelic-lambda-wrapper.handler",
      code: lambda.Code.fromAsset(path.join(__dirname, '../functions/payment/check-inventory')),
      environment: lambdaEnvironment,
      tracing: lambda.Tracing.ACTIVE,
      layers: [NRLayer],
      memorySize: 256,
      timeout: cdk.Duration.seconds(15),
    });

    const updateInventoryFunction = new lambda.Function(this, 'UpdateInventoryFunction', {
      runtime: lambda.Runtime.NODEJS_22_X,
      handler: "newrelic-lambda-wrapper.handler",
      code: lambda.Code.fromAsset(path.join(__dirname, '../functions/payment/update-inventory')),
      environment: lambdaEnvironment,
      tracing: lambda.Tracing.ACTIVE,
      layers: [NRLayer],
      memorySize: 256,
      timeout: cdk.Duration.seconds(15),
    });

    // Grant permissions
    productsTable.grantReadData(getProductsFunction);
    productsTable.grantReadData(getProductByIdFunction);
    productsTable.grantReadData(getProductsByCategoryFunction);
    productsTable.grantReadData(addToCartFunction);
    productsTable.grantReadWriteData(checkInventoryFunction);
    productsTable.grantReadWriteData(updateInventoryFunction);

    cartTable.grantReadWriteData(addToCartFunction);
    cartTable.grantReadData(getCartFunction);
    cartTable.grantReadWriteData(removeFromCartFunction);
    cartTable.grantReadData(createOrderFunction);

    ordersTable.grantReadWriteData(createOrderFunction);
    ordersTable.grantReadData(getOrdersFunction);

    // Step Function for Payment Processing
    const checkInventory = new tasks.LambdaInvoke(this, 'Check Inventory', {
      lambdaFunction: checkInventoryFunction,
      outputPath: '$.Payload',
    });

    const processPayment = new tasks.LambdaInvoke(this, 'Process Payment', {
      lambdaFunction: processPaymentFunction,
      outputPath: '$.Payload',
    });

    const updateInventory = new tasks.LambdaInvoke(this, 'Update Inventory', {
      lambdaFunction: updateInventoryFunction,
      outputPath: '$.Payload',
    });

    const createOrder = new tasks.LambdaInvoke(this, 'Create Order', {
      lambdaFunction: createOrderFunction,
      outputPath: '$.Payload',
    });

    const paymentFailed = new sfn.Fail(this, 'Payment Failed', {
      cause: 'Payment processing failed',
      error: 'PaymentError',
    });

    const inventoryFailed = new sfn.Fail(this, 'Inventory Check Failed', {
      cause: 'Insufficient inventory',
      error: 'InventoryError',
    });

    const orderFailed = new sfn.Fail(this, 'Order Creation Failed', {
      cause: 'Order creation failed',
      error: 'OrderError',
    });

    const paymentSucceeded = new sfn.Succeed(this, 'Payment Processed Successfully');

    // Define the workflow
    const definition = checkInventory
      .next(new sfn.Choice(this, 'Inventory Available?')
        .when(sfn.Condition.booleanEquals('$.inventoryAvailable', true), processPayment
          .next(new sfn.Choice(this, 'Payment Successful?')
            .when(sfn.Condition.booleanEquals('$.paymentSuccessful', true), updateInventory
              .next(createOrder
                .next(new sfn.Choice(this, 'Order Created?')
                  .when(sfn.Condition.booleanEquals('$.orderCreated', true), paymentSucceeded)
                  .otherwise(orderFailed))))
            .otherwise(paymentFailed)))
        .otherwise(inventoryFailed));

    const paymentProcessingStateMachine = new sfn.StateMachine(this, 'PaymentProcessingStateMachine', {
      definition,
      timeout: cdk.Duration.minutes(5),
    });

    // API Gateway
    const api = new apigateway.RestApi(this, 'EcommerceApi', {
      restApiName: 'Ecommerce Service',
      description: 'This service serves the e-commerce application.',
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
      },
    });

    // Products API
    const productsResource = api.root.addResource('products');
    productsResource.addMethod('GET', new apigateway.LambdaIntegration(getProductsFunction));

    const productResource = productsResource.addResource('{id}');
    productResource.addMethod('GET', new apigateway.LambdaIntegration(getProductByIdFunction));

    const categoriesResource = productsResource.addResource('category');
    const categoryResource = categoriesResource.addResource('{category}');
    categoryResource.addMethod('GET', new apigateway.LambdaIntegration(getProductsByCategoryFunction));

    // Cart API
    const cartResource = api.root.addResource('cart');
    cartResource.addMethod('GET', new apigateway.LambdaIntegration(getCartFunction));
    cartResource.addMethod('POST', new apigateway.LambdaIntegration(addToCartFunction));

    const cartItemResource = cartResource.addResource('{productId}');
    cartItemResource.addMethod('DELETE', new apigateway.LambdaIntegration(removeFromCartFunction));

    // Orders API
    const ordersResource = api.root.addResource('orders');
    ordersResource.addMethod('GET', new apigateway.LambdaIntegration(getOrdersFunction));
    ordersResource.addMethod('POST', new apigateway.LambdaIntegration(createOrderFunction));

    // Payment API - Trigger Step Function
    const paymentResource = api.root.addResource('payment');

    const stepFunctionsIntegrationRole = new iam.Role(this, 'StepFunctionsIntegrationRole', {
      assumedBy: new iam.ServicePrincipal('apigateway.amazonaws.com'),
    });

    paymentProcessingStateMachine.grantStartExecution(stepFunctionsIntegrationRole);

    const stepFunctionsIntegration = new apigateway.AwsIntegration({
      service: 'states',
      action: 'StartExecution',
      options: {
        credentialsRole: stepFunctionsIntegrationRole,
        requestTemplates: {
          'application/json': `{
            "input": "$util.escapeJavaScript($input.json('$'))",
            "stateMachineArn": "${paymentProcessingStateMachine.stateMachineArn}"
          }`,
        },
        integrationResponses: [
          {
            statusCode: '200',
            responseTemplates: {
              'application/json': `{
                "executionArn": "$input.path('$.executionArn')",
                "startDate": "$input.path('$.startDate')"
              }`,
            },
          },
          {
            selectionPattern: '4\\d{2}',
            statusCode: '400',
            responseTemplates: {
              'application/json': `{
                "error": "Bad request"
              }`,
            },
          },
          {
            selectionPattern: '5\\d{2}',
            statusCode: '500',
            responseTemplates: {
              'application/json': `{
                "error": "Internal server error"
              }`,
            },
          },
        ],
      },
    });

    paymentResource.addMethod('POST', stepFunctionsIntegration, {
      methodResponses: [
        { statusCode: '200' },
        { statusCode: '400' },
        { statusCode: '500' },
      ],
    });

    // Outputs
    new cdk.CfnOutput(this, 'ApiEndpoint', {
      value: api.url,
      description: 'API Gateway endpoint URL',
    });

    new cdk.CfnOutput(this, 'ProductsTableName', {
      value: productsTable.tableName,
      description: 'Products DynamoDB table name',
    });

    new cdk.CfnOutput(this, 'CartTableName', {
      value: cartTable.tableName,
      description: 'Cart DynamoDB table name',
    });

    new cdk.CfnOutput(this, 'OrdersTableName', {
      value: ordersTable.tableName,
      description: 'Orders DynamoDB table name',
    });

    new cdk.CfnOutput(this, 'StateMachineArn', {
      value: paymentProcessingStateMachine.stateMachineArn,
      description: 'Payment Processing State Machine ARN',
    });
  }
}