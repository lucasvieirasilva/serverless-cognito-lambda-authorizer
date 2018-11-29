// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
import config from './config.json';

export const environment = {
  production: false,
  amplify: {
    Auth: {
      region: config.AwsRegion,
      userPoolId: config.UserPoolId,
      userPoolWebClientId: config.UserPoolClientId
    }
  },
  apiGateway: {
    invokeUrl: config.AwsApiGatewayInvokeUrl
  },
};
