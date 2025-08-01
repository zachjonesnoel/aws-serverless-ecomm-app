#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { EcommerceStack } from '../lib/ecommerce-stack';

const app = new cdk.App();
new EcommerceStack(app, 'EcommerceStack', {
  env: { 
    account: process.env.CDK_DEFAULT_ACCOUNT, 
    region: process.env.CDK_DEFAULT_REGION 
  },
  description: 'Serverless E-commerce Application Stack'
});