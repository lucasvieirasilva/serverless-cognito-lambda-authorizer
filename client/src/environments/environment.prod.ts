import config from './config.json';

export const environment = {
  production: true,
  amplify: {
    Auth: {
      region: config.AwsRegion,
      userPoolId: config.UserPoolId,
      userPoolWebClientId: config.UserPoolClientId
    }
  }
};
