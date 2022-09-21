import * as cdk from 'aws-cdk-lib';
import { gitlab_token } from './token'; 
import { Construct } from 'constructs';
import { autoscaling_group } from './autoscaling_group';
import { CfnParameter, stringToCloudFormation } from 'aws-cdk-lib';


export class RunnersStack extends cdk.Stack {

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const url = process.env.URL;

    const private_token = process.env.PRIVATE_TOKEN

    const create_runner_token = new gitlab_token(this, url, private_token);
    const asg = new autoscaling_group(this)
    }
  }

