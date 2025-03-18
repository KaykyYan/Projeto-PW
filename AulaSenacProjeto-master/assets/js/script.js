function mostrarErro(mensagem) {
    var errorMessageDiv = document.getElementById('error-message');
    errorMessageDiv.innerText = mensagem;
    errorMessageDiv.style.display = 'block';
}

function validarInformacoeslogin() {
    var emailLogin = document.getElementById('email').value;
    var senhaLogin = document.getElementById('senha').value;

    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

    // Verificar se os campos estão preenchidos
    if (!emailLogin || !senhaLogin) {
        alert("Por favor, preencha todos os campos.");
        return false;
    } 
    // Verificar se o e-mail é válido
    else if (!emailRegex.test(emailLogin)) {
        alert("Por favor, insira um E-mail válido.");
        return false;
    }
    return true;
}

function validarInformacoesforms() {
    var nomeForms = document.getElementById('nome').value;
    var emailForms = document.getElementById('email').value;
    var senhaForms = document.getElementById('senha').value;
    var confirmarsenhaForms = document.getElementById('confirmar-senha').value;
    var termosForms = document.getElementById('termos').checked;
    console.log(nomeForms);
    console.log(emailForms);
    console.log(senhaForms);
    console.log(confirmarsenhaForms);
    console.log(termosForms);

    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

    document.getElementById('error-message').style.display = 'none';

    // Verificar se os campos estão preenchidos
    if (!nomeForms || !emailForms || !senhaForms || !confirmarsenhaForms) {
        mostrarErro("Por favor, preencha todos os campos.");
        return false;
    } 

    // Verificar se o e-mail é válido
    if (!emailRegex.test(emailForms)) {
        mostrarErro("Por favor, insira um e-mail válido.");
        return false;
    }

    // Verificar se a senha tem pelo menos 6 caracteres
    if (senhaForms.length < 6) {
        mostrarErro("A senha deve ter pelo menos 6 caracteres.");
        return false;
    }

    // Verificar se as senhas coincidem
    if (senhaForms !== confirmarsenhaForms) {
        mostrarErro("As senhas não coincidem.");
        return false;
    }

    // Verificar se os termos foram aceitos
    if (!termosForms) {
        mostrarErro("Você deve concordar com os termos de uso.");
        return false;
    }
    return true;
}