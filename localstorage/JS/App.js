function registrarUsuario() {
    let nombre = document.getElementById('nombres').value;
    let apellido = document.getElementById('apellidos').value;
    let correo = document.getElementById('correo').value;
    let clave = document.getElementById('clave').value;
    let confirmarClave = document.getElementById('confirmarClave').value;
    let fechaNacimiento = document.getElementById('fechaNacimiento').value;

    if (nombre == '' || apellido == '' || correo == '' || clave == '' || confirmarClave == '' || fechaNacimiento == '') {
        alert("porfavor rellene todos los campos");
        return;
    }

    if (clave !== confirmarClave) {
        alert("no coinciden las claves");
        document.getElementById('clave').style.borderColor = 'red';
        document.getElementById('confirmarClave').style.borderColor = 'red';
        return;
    }

    if (clave.length < 8) {
        alert("la clave tiene minimo 8 caracteres");
        document.getElementById('clave').style.borderColor = 'red';
        return;

    
    }

    if(localStorage.getItem('usuario_' + correo)){
        alert("eñ correo ya esta regitrado");
        return;
    }

    let usuario ={
        nombre: nombre,
        apellido:apellido,
        correo:correo,
        clave:clave,
        fechaNacimiento:fechaNacimiento,
    };

    localStorage.setItem('usuario_' + correo, JSON.stringify(usuario));
    alert("usuario registrado con exito");
    window.location.href = 'index.html';



}

function iniciarSesion() {
    let correo = document.getElementById('correo').value;
    let clave = document.getElementById('clave').value;
    let datos = localStorage.getItem('usuario_' +correo);

    if(!datos){
        alert("usuario no registrado");
        return;

    }

    let usuario = JSON.parse (datos);
    if(usuario.clave !== clave){
        alert("clave incorrecto")
        return;
    }

    localStorage.setItem('usuarioActivo', correo);
    window.location.href = 'inicio.html';
}