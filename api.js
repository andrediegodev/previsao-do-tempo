function atualizarBarra(uv){

    const preenchimento = document.querySelector('.preenchimentoBarra');
    const textoUV = document.querySelector('.conteudoRaiosUV');
    const porcentagem = (uv/10) * 100;

    preenchimento.style.width = `${porcentagem}%`

    textoUV.textContent = uv;
}

async function buscarClima() {
    const cidade = document.getElementById('pesquisaCidade').value;
    const apiKey = '33a66b4b7e46425294d164059251905';
    const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${cidade}&lang=pt&days=1`;

    try {
        const resposta = await fetch(url);
        if (!resposta.ok) throw new Error('Cidade não encontrada');

        const dados = await resposta.json();

        // Dados da localização
        const nome = dados.location.name;
        const regiao = dados.location.region;

        // Dados do clima atual
        const temp = Math.round(dados.current.temp_c);
        const sensacao = Math.round(dados.current.feelslike_c);
        const vento = Math.round(dados.current.wind_kph);
        const precipitacao = Math.round(dados.current.precip_mm);
        const umidade = dados.current.humidity;
        const condicao = dados.current.condition.text;
        const uv = dados.current.uv;

        // Dados da lua
        const lua = dados.forecast.forecastday[0].astro.moon_phase;

// JS
const condicoes = {
    "Sol": "bi-sun-fill",
    "Parcialmente nublado" : "bi-cloud-sun" ,
    "Nublado" : "bi-cloud" ,
    "Chuva" : "bi-cloud-rain",
    "Chuva Fraca" : "bi-cloud-drizzle",
    "Céu limpo" : "bi-moon-fill",
    "Cheio de nuvens": "bi-cloud-fog2",
    "Neblina" : "bi-water"
};

// Dentro de buscarClima()
// Atualiza o texto da condição normalmente
document.querySelector('.condicaoBody').innerText = condicao;

// Puxa o ícone correspondente à condição (ou um ícone padrão)
const iconeClasse = condicoes[condicao] ;

// Atualiza o elemento do ícone, se ele existir
const iconeEl = document.querySelector('.iconeCondicao');
if (iconeEl) {
  iconeEl.className = `bi ${iconeClasse} iconeCondicao`;
}




        // Atualizando os elementos HTML
        document.querySelector('.temperatura').innerText = `${temp}º`;
        document.querySelector('.localizacaoBody').innerHTML = `<i class="fa-solid fa-location-dot"></i>` + `${nome}, ${regiao}`;

            
        document.querySelector('.conteudoSensacao').innerHTML = `${sensacao}º <i class="fa-solid fa-temperature-three-quarters"></i>`;
        document.querySelector('.conteudoPrecipitacao').innerText = precipitacao;
        document.querySelector('.conteudoUmidade').innerText = umidade;
        document.querySelector('.conteudoVento').innerText = vento;
        document.querySelector('.conteudoLua').innerText = traduzirFaseLua(lua);
        document.querySelector('.conteudoRaiosUV').innerText = uv;

        atualizarBarra(uv);

    } catch (erro) {
        alert(`Erro: ${erro.message}`);
    }
}



function traduzirFaseLua(fase) {
    const fases = {
        "New Moon": "Lua Nova",
        "Waxing Crescent": "Crescente Côncava",
        "First Quarter": "Quarto Crescente",
        "Waxing Gibbous": "Crescente Gibosa",
        "Full Moon": "Lua Cheia",
        "Waning Gibbous": "Minguante Gibosa",
        "Last Quarter": "Quarto Minguante",
        "Waning Crescent": "Minguante Côncava"
    };
    return fases[fase] || fase;
}

async function buscarPorLocalizacao() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async(position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            const apiKey = '33a66b4b7e46425294d164059251905';
            const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${lat},${lon}&lang=pt&days=1`;

            try {
                const resposta = await fetch(url);
                if (!resposta.ok) throw new Error('Erro ao buscar dados da localização');

                const dados = await resposta.json();

                const nome = dados.location.name;
                dados.forEach(name => {
                    if(name === 'San Paulo' && 'Sao Paulo' ){
                      return  nome = 'São Paulo';
                    }
                });
                const regiao = dados.location.region;
              
                const temp = Math.round(dados.current.temp_c);
                const sensacao = Math.round(dados.current.feelslike_c);
                const vento = Math.round(dados.current.wind_kph);
                const precipitacao = dados.current.precip_mm;
                const umidade = dados.current.humidity;
                const condicao = dados.current.condition.text;
                const uv = dados.current.uv;
                const lua = dados.forecast.forecastday[0].astro.moon_phase;

                document.querySelector('.infoSubHeader').innerText = `Previsão para sua região: ${nome} - ${regiao}, ${temp}º`;
                document.querySelector('.temperatura').innerText = `${temp}º`;
                document.querySelector('.localizacaoBody').innerHTML = `<i class="fa-solid fa-location-dot"></i> ${nome} - ${regiao}`;
                document.querySelector('.condicaoBody').innerText = condicao.toUpperCase();
                document.querySelector('.conteudoSensacao').innerHTML = `${sensacao}º <i class="fa-solid fa-temperature-three-quarters"></i>`;
                document.querySelector('.conteudoPrecipitacao').innerText = precipitacao;
                document.querySelector('.conteudoUmidade').innerText = umidade;
                document.querySelector('.conteudoVento').innerText = vento;
                document.querySelector('.conteudoLua').innerText = traduzirFaseLua(lua);
                document.querySelector('.conteudoRaiosUV').innerText = uv;

                atualizarBarra(uv);

            } catch (erro) {
                alert(`Erro: ${erro.message}`);
            }
        }, () => {
            alert('Permissão de localização negada.');
        });
    } else {
        alert('Geolocalização não suportada pelo navegador.');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    buscarPorLocalizacao();
})


const input = document.getElementById('pesquisaCidade');
const sugestoes = document.getElementById('sugestoes');
const apiKey = '33a66b4b7e46425294d164059251905';

input.addEventListener('input', async function (){
    const query = input.value;

    if(query.length < 3 ){
        sugestoes.innerHTML = '';
        return
    }

    const url = `https://api.weatherapi.com/v1/search.json?key=${apiKey}&q=${query}`;

    try{
        const resposta = await fetch(url);
        const cidades = await resposta.json();

        sugestoes.innerHTML = '';

        cidades.forEach(cidade => {
            const li = document.createElement('li');
            li.textContent = `${cidade.name}, ${cidade.region} - ${cidade.country}`;
            li.addEventListener('click', ()=>{
                input.value = cidade.name;
                if(cidade.name === 'San Paulo' && 'Sao Paulo'){
                    cidade.name = 'São Paulo';
                }
                sugestoes.innerHTML ='';
            })
            sugestoes.appendChild(li);
        });
    } catch(erro) {
            console.error('Erro ao buscar sugestões', erro);
        }
    })



    document.querySelector('.search').addEventListener('click', function() {
        const cidade = sugestoes;
        if(cidade){
              buscarClima(pesquisaCidade);
              const porcentagem = document.querySelector('.elemento2');
              const conteudoUmidade = document.querySelector('.conteudoUmidade');
              const conteudoVento = document.querySelector('.conteudoVento');
              const conteudoSensacao = document.querySelector('.conteudoSensacao');
              const conteudoPrecipitacao = document.querySelector('.conteudoPrecipitacao')
              const conteudoLua = document.querySelector('.conteudoLua');
              const iconeSensacao = document.querySelector('.fa-temperature-three-quarters');
              const iconePrecipitacao = document.querySelector('.fa-cloud-showers-heavy');

              iconeSensacao.style.display = 'block';
              iconePrecipitacao.style.display = 'block'
              porcentagem.style.display = 'block';
              conteudoUmidade.style.display = 'block';
              conteudoPrecipitacao.style.display = 'block';
              conteudoVento.style.display = 'block';
              conteudoSensacao.style.display = 'block';
              conteudoLua.style.display ='block'
        }
});

