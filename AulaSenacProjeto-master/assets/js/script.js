var apiKey = "5bd94c679f7fe4e72163ff569e439bce";

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

    document.getElementById('error-message').style.display = 'none';

    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

    // Validações dos campos
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

    // Validação do reCAPTCHA
    if (!validarRecaptcha()) {
        mostrarErro("Por favor, confirme que você não é um robô.");
        return false;
    }

    // Tudo validado
    alert("Cadastro realizado com sucesso!");
    document.querySelector('.formulario-login').reset();

    return false; // Evita o envio real do formulário (para testes)
}

// Validação do reCAPTCHA v2
function validarRecaptcha() {
    const response = grecaptcha.getResponse();
    if (response.length === 0) {
        return false; // Não foi validado
    }
    return true; // Validado
}

// Busca endereço automaticamente via API ViaCEP + temperatura via OpenWeather
function buscarEnderecoPorCEP() {
    const cep = document.getElementById("cep").value.replace(/\D/g, '');

    if (cep.length !== 8 || isNaN(cep)) {
        alert("CEP inválido. Digite 8 números.");
        document.getElementById('endereco').value = "";
        return;
    }

    const urlViaCEP = `https://viacep.com.br/ws/${cep}/json/`;
    fetch(urlViaCEP)
        .then(response => response.json())
        .then(data => {
            if (data.erro) {
                alert("CEP não encontrado.");
                document.getElementById('endereco').value = "";
            } else {
                const enderecoCompleto = `${data.logradouro}, ${data.bairro}, ${data.localidade} - ${data.uf}`;
                document.getElementById("endereco").value = enderecoCompleto;
                consultarTemperaturaPorCidade(data.localidade, data.uf); // reaproveita os dados
            }
        })
        .catch(error => {
            console.error("Erro ao buscar o CEP:", error);
        });
}

// Consulta temperatura com base na cidade e estado (sem duplicar a chamada do ViaCEP)
function consultarTemperaturaPorCidade(cidade, estado) {
    const widget = document.getElementById('widget-clima');
    const widgetCidade = document.getElementById('widget-cidade');
    const widgetTemp = document.getElementById('widget-temp');
    const widgetIcon = document.getElementById('widget-icon');

    const geocodeUrl = `https://nominatim.openstreetmap.org/search?city=${encodeURIComponent(cidade)}&state=${estado}&country=Brazil&format=json`;

    fetch(geocodeUrl)
        .then(response => {
            if (!response.ok) throw new Error("Erro na busca de coordenadas.");
            return response.json();
        })
        .then(locations => {
            if (!locations || locations.length === 0) throw new Error("Coordenadas não encontradas para a cidade.");

            const lat = locations[0].lat;
            const lon = locations[0].lon;

            const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;

            return fetch(weatherUrl);
        })
        .then(response => {
            if (!response.ok) throw new Error("Erro na resposta da API do clima.");
            return response.json();
        })
        .then(data => {
            const temperatura = data.main.temp;
            const iconCode = data.weather[0].icon;

            widgetCidade.textContent = cidade;
            widgetTemp.textContent = `${temperatura}°C`;
            widgetIcon.style.backgroundImage = `url(http://openweathermap.org/img/wn/${iconCode}.png)`;
            widgetIcon.style.width = "24px";
            widgetIcon.style.height = "24px";
            widgetIcon.style.backgroundSize = "cover";
            widget.style.display = 'flex';
        })
        .catch(error => {
            console.error("❌ Erro ao consultar a temperatura:", error.message);
            widget.style.display = 'none';
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