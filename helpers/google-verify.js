const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const googleVerify = async(idToken = '') => {

    const ticket = await client.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID,
    });

    //const payload = ticket.getPayload();
    //console.log(payload);

    const {name, picture, email} = ticket.getPayload();

    return {
        nombre: name,
        img: picture,
        correo: email
    }
}

module.exports = {
    googleVerify
}