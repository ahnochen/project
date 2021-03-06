import * as path from "path";
import * as cdk from "aws-cdk-lib";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import * as iam from "aws-cdk-lib/aws-iam";
import * as lambdaNodejs from "aws-cdk-lib/aws-lambda-nodejs";
import { RestApi, HttpMethod } from "@softchef/cdk-restapi";
import { Construct } from "constructs";

export interface TestAppStackProps extends cdk.NestedStackProps {
  readonly authorizationType?: apigateway.AuthorizationType;
  readonly authorizer?: apigateway.IAuthorizer | undefined;
}

// const {
//   CDK_DEPLOY_ACCOUNT,
//   CDK_DEPLOY_REGION,
// } = process.env;

const LAMBDA_ASSETS_PATH = path.resolve(__dirname, "./lambda");

export class projectServiceStack extends cdk.Stack {
  public readonly restApiId: string;

  constructor(scope: Construct, id: string, props?: TestAppStackProps) {
    super(scope, id);

    const restApi = new RestApi(this, "CloudAppRestApi", {
      enableCors: true,
      authorizationType:
        props?.authorizationType ?? apigateway.AuthorizationType.NONE,
      authorizer: props?.authorizer ?? undefined,
      resources: [
        {
          // test
          path: "/test",
          httpMethod: HttpMethod.GET,
          lambdaFunction: this.createTestFunction(),
          authorizationType: apigateway.AuthorizationType.IAM,
        },
        {
          // test
          path: "/apple",
          httpMethod: HttpMethod.GET,
          lambdaFunction: this.createAppleFunction(),
          authorizationType: apigateway.AuthorizationType.IAM,
        },
      ],
    });

    this.restApiId = restApi.restApiId;
  }

  private createTestFunction(): lambdaNodejs.NodejsFunction {
    const testFunction = new lambdaNodejs.NodejsFunction(this, "testFunction", {
      entry: `${LAMBDA_ASSETS_PATH}/hello-world/app.ts`,
    });
    testFunction.role?.attachInlinePolicy(
      new iam.Policy(this, "TestFunctionPolicy", {
        statements: [
          new iam.PolicyStatement({
            actions: [
              "execute-api:Invoke",
              "execute-api:ManageConnections"
            ],
            resources: ["*"],
          }),
        ],
      })
    );
    return testFunction;
  }
  private createAppleFunction(): lambdaNodejs.NodejsFunction {
    const appleFunction = new lambdaNodejs.NodejsFunction(this, "appleFunction", {
      entry: `${LAMBDA_ASSETS_PATH}/apple/app.ts`,
    });
    appleFunction.role?.attachInlinePolicy(
      new iam.Policy(this, "AppleFunctionPolicy", {
        statements: [
          new iam.PolicyStatement({
            actions: [
              "execute-api:Invoke",
              "execute-api:ManageConnections"
            ],
            resources: ["*"],
          }),
        ],
      })
    );
    return appleFunction;
  }
}

const stackName = process.env.STACK_NAME || "projectServiceStack";

export class ProjectServiceApp extends cdk.Stack {
  constructor(scope: Construct, id: string, props: cdk.StackProps = {}) {
    super(scope, id, props);
    new projectServiceStack(this, stackName);
  }
}

const app = new cdk.App();

new ProjectServiceApp(app, "ProjectServiceApp-dev", {
  stackName: process.env.STACK_NAME,
});
app.synth();

