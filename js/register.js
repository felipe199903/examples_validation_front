
const fields = document.querySelectorAll("[required]")

function ValidateField(field) {
    // logica para verificar se existem erros
    function verifyErrors() {
        let foundError = false;

        for(let error in field.validity) {
            // se não for customError
            // então verifica se tem erro
            if (field.validity[error] && !field.validity.valid ) {
                foundError = error
            }
        }
        return foundError;
    }

    function customMessage(typeError) {
        const messages = {
            text: {
                valueMissing: "Por favor, preencha este campo"
            },
            email: {
                valueMissing: "Email é obrigatório",
                typeMismatch: "Por favor, preencha um email válido"
            }
        }

        return messages[field.type][typeError]
    }

    function setCustomMessage(message) {
        const spanError = field.parentNode.querySelector("span.error")
        
        if (message) {
            spanError.classList.add("active")
            spanError.innerHTML = message
        } else {
            spanError.classList.remove("active")
            spanError.innerHTML = ""
        }
    }

    return function() {

        const error = verifyErrors()

        if(error) {
            const message = customMessage(error)

            field.style.borderColor = "red"
            setCustomMessage(message)
        } else {
            field.style.borderColor = "green"
            setCustomMessage()
        }
    }
}


function customValidation(event) {

    const field = event.target
    const validation = ValidateField(field)

    validation()

}

for( field of fields ){
    field.addEventListener("invalid", event => { 
        // eliminar o bubble
        event.preventDefault()

        customValidation(event)
    })
    field.addEventListener("blur", customValidation)
}


document.querySelector("form").addEventListener("submit", event => {
    console.log("efetuando cadastro...")

    let email = document.getElementById("email");
    let name = document.getElementById("name");
    let password1 = document.getElementById("password1");
    let password2 = document.getElementById("password2");

    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "http://52.91.139.190/fsapi/users/auth/register-jwt", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var json = JSON.parse(this.responseText);
            document.getElementById("register-sucess").innerHTML = 'Register sucess '+ json.user.name;
        }
    };
    xhttp.send(JSON.stringify({
        "email": email.value,
        "name": name.value,
        "password": password1.value,
        "confirma_password": password2.value
    }));

    // não vai enviar o formulário
    event.preventDefault()
})