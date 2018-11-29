export const handler = async (event, context, callback) => {
    event.response.autoConfirmUser = true;
    callback(null, event);
};