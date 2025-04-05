  // Exibe mensagem de erro
function mostrarErro(mensagem) {
const errorMessageDiv = document.getElementById('error-message');
errorMessageDiv.innerText = mensagem;
errorMessageDiv.style.display = 'block';
errorMessageDiv.scrollIntoView({ behavior: 'smooth' }); // Rola até a mensagem
}

// Validação do formulário
function validarInformacoesforms() {
const nome = document.getElementById('nome').value.trim();
const email = document.getElementById('email').value.trim();
const cep = document.getElementById('cep').value.trim().replace(/\D/g, '');
const endereco = document.getElementById('endereco').value.trim();
const senha = document.getElementById('senha').value;
const confirmarSenha = document.getElementById('confirmar-senha').value;
const termos = document.getElementById('termos').checked;
const captchaResponse = grecaptcha.getResponse();

document.getElementById('error-message').style.display = 'none';

const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

if (!nome || !email || !cep || !endereco || !senha || !confirmarSenha) {
    mostrarErro("Por favor, preencha todos os campos.");
    return false;
}

if (!emailRegex.test(email)) {
    mostrarErro("Por favor, insira um e-mail válido.");
    return false;
}

if (cep.length !== 8 || isNaN(cep)) {
    mostrarErro("Por favor, insira um CEP válido com 8 dígitos.");
    return false;
}

if (senha.length < 6) {
    mostrarErro("A senha deve ter pelo menos 6 caracteres.");
    return false;
}

if (senha !== confirmarSenha) {
    mostrarErro("As senhas não coincidem.");
    return false;
}

if (!termos) {
    mostrarErro("Você deve concordar com os termos de uso.");
    return false;
}

if (!captchaResponse) {
    mostrarErro("Por favor, confirme que você não é um robô.");
    return false;
}

grecaptcha.ready(function () {
    grecaptcha.execute('6LdgcworAAAAAKQ6wqXMEfnZ4tPgYJ0ZMD_M_hQz', { action: 'submit' }).then(function (token) {
    if (!token) {
        mostrarErro("Verificação reCAPTCHA falhou. Recarregue a página.");
        return false;
    }

    alert("Cadastro realizado com sucesso!");
    document.querySelector('.formulario-login').reset();
    grecaptcha.reset(); // Reset do captcha após sucesso
    });
});

return false; // Evita envio padrão
}

// Busca endereço automaticamente via API ViaCEP
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

  // Carrossel de feedback ou imagens

document.addEventListener('DOMContentLoaded', function () {
const carrossel = document.querySelector('.carrossel-imagem-inicio');
const btnAnterior = document.querySelector('.carrossel-btn.prev');
const btnProximo = document.querySelector('.carrossel-btn.next');

const scrollAmount = 320; // Valor estimado do tamanho de uma imagem + margem

if (carrossel && btnAnterior && btnProximo) {
    btnAnterior.addEventListener('click', () => {
    carrossel.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    });

    btnProximo.addEventListener('click', () => {
    carrossel.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    });
}
});

