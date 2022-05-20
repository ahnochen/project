import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";

export class projectServiceStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);




  }
}


const app = new cdk.App();
new projectServiceStack(app, "projectServiceStack");
app.synth();