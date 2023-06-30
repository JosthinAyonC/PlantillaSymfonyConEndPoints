

//EDITAR CONTRASENIA

let formPassedit = document.getElementById("form-passedit");
let btn_passedit = document.getElementById("passedit");let respuesta
try {

    btn_passedit.addEventListener("click", async function () {
        let formData = new FormData(formPassedit);
        let data = Object.fromEntries(formData);

        let claveN = formData.get("claveNueva");
        let claveC = formData.get("claveNuevaConfirmar");

        let jsonData = JSON.stringify(data);

        if (claveN == claveC) {

            const idUser = formData.get("id");

            let respuesta = await fetch(`/usuario/${idUser}/change/pass`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: jsonData
            });
            const response = await respuesta.json();
            const mensaje = response.msg;
            alert(mensaje);
            if (respuesta.status == 200) {
                location.replace('/');
            }

        } else {
            alert("Verifique las claves ingresadas sean iguales")
        }
    });
} catch (error) {
    console.log(error);
}

