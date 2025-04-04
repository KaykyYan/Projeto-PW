function mostrarErro(mensagem) {
    var errorMessageDiv = document.getElementById('error-message');
    errorMessageDiv.innerText = mensagem;
    errorMessageDiv.style.display = 'block';
}

function validarInformacoesforms() {
    var nome = document.getElementById('nome').value.trim();
    var email = document.getElementById('email').value.trim();
    var cep = document.getElementById('cep').value.trim().replace(/\D/g, '');
    var endereco = document.getElementById('endereco').value.trim();
    var senha = document.getElementById('senha').value;
    var confirmarSenha = document.getElementById('confirmar-senha').value;
    var termos = document.getElementById('termos').checked;
    var captchaResponse = grecaptcha.getResponse();

    document.getElementById('error-message').style.display = 'none';

    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

    // Verificação de campos obrigatórios
    if (!nome || !email || !cep || !endereco || !senha || !confirmarSenha) {
        mostrarErro("Por favor, preencha todos os campos.");
        return false;
    }

    // Validação de e-mail
    if (!emailRegex.test(email)) {
        mostrarErro("Por favor, insira um e-mail válido.");
        return false;
    }

    // Validação de CEP (formato)
    if (cep.length !== 8 || isNaN(cep)) {
        mostrarErro("Por favor, insira um CEP válido com 8 dígitos.");
        return false;
    }

    // Validação de senha
    if (senha.length < 6) {
        mostrarErro("A senha deve ter pelo menos 6 caracteres.");
        return false;
    }

    if (senha !== confirmarSenha) {
        mostrarErro("As senhas não coincidem.");
        return false;
    }

    // Validação de aceite dos termos
    if (!termos) {
        mostrarErro("Você deve concordar com os termos de uso.");
        return false;
    }

    // Validação do reCAPTCHA
    if (!captcha) {
        alert("Por favor, confirme que você não é um robô.");
        return;
    }

    grecaptcha.ready(function () {
        grecaptcha.execute('6LdgcworAAAAAKQ6wqXMEfnZ4tPgYJ0ZMD_M_hQz', { action: 'submit' }).then(function (token) {
            if (!token) {
                mostrarErro("Verificação reCAPTCHA falhou. Recarregue a página.");
                return false;
            }

            // Aqui você apenas confia no token como uma verificação leve
            alert("Cadastro realizado com sucesso!");
            document.querySelector('.formulario-login').reset();
        });
    });
    
    alert("Cadastro realizado com sucesso!");
    document.querySelector('.formulario-login').reset();
    grecaptcha.reset();
    return false;
}

function buscarEnderecoPorCEP() {
    const cep = document.getElementById("cep").value.replace(/\D/g, '');

    if (cep.length !== 8 || isNaN(cep)) {
        alert("CEP inválido. Digite 8 números.");
        document.getElementById('endereco').value = "";
        return;
    }

    const url = `https://viacep.com.br/ws/${cep}/json/`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.erro) {
                alert("CEP não encontrado.");
                document.getElementById('endereco').value = "";
            } else {
                const enderecoCompleto = `${data.logradouro}, ${data.bairro}, ${data.localidade} - ${data.uf}`;
                document.getElementById("endereco").value = enderecoCompleto;
            }
        })
        .catch(error => {
            console.error("Erro ao buscar o CEP:", error);
        });
}
