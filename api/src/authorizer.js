const https = require('https');
const jose = require('node-jose');

const KEY_URL = `https://cognito-idp.${process.env.AWS_REGION}.amazonaws.com/${process.env.USER_POOL_ID}/.well-known/jwks.json`

module.exports.handler = (event, context, callback) => {
    const bearer = event.authorizationToken;
    if (!bearer) return callback('Unauthorized');

    https.get(KEY_URL, (response) => {
        if (response.statusCode == 200) {
            response.on('data', async (body) => {
                const keys = JSON.parse(body)['keys'];

                const claims = await verifySignature(keys, bearer, callback);

                if (claims) {
                    const authResponse = buildAllowAllPolicy(event, claims.sub);
                    authResponse.context = {
                        sub: claims.sub,
                        email_verified: claims.email_verified,
                        email: claims.email,
                        "cognito:username": claims['cognito:username'] 
                    };

                    callback(null, authResponse);
                }
            });
        }
    });
}

const verifySignature = async (keys, bearer, callback) => {
    try {
        const token = bearer.split(" ")[1];
        const sections = token.split('.');
        let header = jose.util.base64url.decode(sections[0]);
        header = JSON.parse(header);
        const kid = header.kid;

        let key_index = -1;
        for (let i = 0; i < keys.length; i++) {
            if (kid == keys[i].kid) {
                key_index = i;
                break;
            }
        }
        if (key_index == -1) {
            callback('Unauthorized');
            return;
        }

        const result = await jose.JWK.asKey(keys[key_index]);

        const verifyResult = await jose.JWS.createVerify(result).verify(token);

        const claims = JSON.parse(verifyResult.payload);

        const current_ts = Math.floor(new Date() / 1000);

        if (current_ts > claims.exp || claims.aud != process.env.USER_POOL_CLIENT_ID) {
            callback('Unauthorized');
            return;
        }

        return claims;
    } catch (error) {
        console.log(error);
        callback('Unauthorized');
        return;
    }
}

const buildAllowAllPolicy = (event, principalId) => {
    const policy = {
        principalId: principalId,
        policyDocument: {
            Version: '2012-10-17',
            Statement: [{
                Action: 'execute-api:Invoke',
                Effect: 'Allow',
                Resource: [event.methodArn]
            }]
        }
    }
    return policy
}