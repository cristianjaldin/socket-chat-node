const miFormulario = document.querySelector('form');


miFormulario.addEventListener('submit', evento => {
    evento.preventDefault();
    const formData = {};
    for (let element of miFormulario.elements) {
        if (element.namespaceURI.length > 0) {
            formData[element.name] = element.value;
        }
    }
    console.log(formData);

    fetch(url='/api/auth/login',{
        method: 'POST',
        body: JSON.stringify(formData),
        headers: {'Content-Type': 'application/json'}
    })
    .then(resp => resp.json())
    .then(({msg, token}) => {
       if (msg) {
           return console.error(msg);
       }
       
       localStorage.setItem('token', token);
       window.location = 'chat.html';
    })
    .catch(err => {
        console.log(err)
    })

});

function handleCredentialResponse(response) {
    // decodeJwtResponse() is a custom function defined by you
    // to decode the credential response.
    //const responsePayload = decodeJwtResponse(response.credential);

    //console.log("ID: " + responsePayload.sub);
    //console.log('Full Name: ' + responsePayload.name);
    //console.log('Given Name: ' + responsePayload.given_name);
    //console.log('Family Name: ' + responsePayload.family_name);
    //console.log("Image URL: " + responsePayload.picture);
    //console.log("Email: " + responsePayload.email);

    // Google Token: ID_TOKEN
    console.log('id_token', response.credential);

    const body = { id_token: response.credential };
    //promesa
    fetch('http://localhost:8080/api/auth/google', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    })
        .then(resp => resp.json())
        .then(({ token }) => {
            console.log(token);
            //localStorage.setItem('email', resp.usuario.correo);
            localStorage.setItem('token', token);
            window.location = 'chat.html';
        })
        .catch(console.warn);
}

const button = document.getElementById('google_signout');

button.onclick = async () => {
    console.log(google.accounts.id);
    google.accounts.id.disableAutoSelect();

    google.accounts.id.revoke(localStorage.getItem('email'), done => {
        console.log('consent revoked');
        localStorage.clear();
        location.reload();
    });


}