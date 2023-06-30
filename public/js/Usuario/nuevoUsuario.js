
//NUEVO USUARIO
let btn_nuevo = document.getElementById("btnNuevo");
let modal = document.getElementById("modal-container");
let close = document.getElementById("close");
let showV = document.getElementById("show");
let formUsuarioNuevo = document.getElementById("nuevo-usuario");


try {
    showV.addEventListener("click", function () {
        modal.classList.add("show-modal");
    });

    close.addEventListener("click", function () {
        modal.classList.remove("show-modal");
    });

    btn_nuevo.addEventListener("click", async function () {

        let formData = new FormData(formUsuarioNuevo);
        // Convertir el objeto FormData a un objeto JavaScript
        let data = Object.fromEntries(formData);
        // Convertir el campo roles a un objeto JavaScript
        data.roles = JSON.parse(data.roles);

        if (data.nombre == "" || data.apellido == "" || data.correo == "" || data.clave == "") {

            alert("Asegurese de llenar todos los datos")

        } else {

            // Convertir el objeto JavaScript a una cadena JSON
            let jsonData = JSON.stringify(data);
            let respuesta = await fetch(`/usuario/nuevo`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: jsonData
            });
            const response = await respuesta.json();
            alert(response.msg);
            modal.classList.remove("show-modal");
            ListarUsuarios();
            formUsuarioNuevo.reset();
        }
    });

} catch (error) {
    console.log(error);
}