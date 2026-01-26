const playButton = document.querySelector('.play-button');
const quizScreen = document.getElementById('quiz-screen');
const playSection = document.getElementById('play');
const titleEl = document.getElementById('question-title');
const pointsEl = document.getElementById('points');
const livesEl = document.getElementById('lives');
const gameOverScreen = document.getElementById('game-over');
const finalPointsEl = document.getElementById('final-points');
const restartButton = document.getElementById('restart-button');
const sentenceEl = document.getElementById('sentence');
const optionsEl = document.getElementById('options');
const timerEl = document.getElementById('timer');

let pontos = 0;
let vidas = 3;
let jogoAtivo = false;
let indicePergunta = 0;
let modo = "idioma";
let podeClicar = true;

let time = 10;
let timerInterval = null;
let respostaCorretaAtual = "";

// START GAME
function startGame() {
    pontos = 0;
    vidas = 3;
    indicePergunta = 0;
    modo = "idioma";
    jogoAtivo = true;

    pointsEl.textContent = pontos;
    livesEl.textContent = vidas;

    playSection.style.display = 'none';
    gameOverScreen.style.display = 'none';
    quizScreen.style.display = 'block';

    mostrarPergunta();
}

playButton.addEventListener('click', startGame);

// TIMER
function formatTime(seconds) {
    return `00:${seconds.toString().padStart(2, '0')}`;
}

function startTimer() {
    clearInterval(timerInterval);

    time = 10;
    timerEl.textContent = formatTime(time);

    timerInterval = setInterval(() => {
        time--;
        timerEl.textContent = formatTime(time);

        if (time <= 0) {
            clearInterval(timerInterval);
            timeOut();
        }
    }, 1000);
}

function timeOut() {
    if (!jogoAtivo) return;

    podeClicar = false;

    if (modo === "idioma") {
        vidas--;
        livesEl.textContent = vidas;
    }


    document.querySelectorAll('.option').forEach(opcao => {
        if (opcao.textContent === respostaCorretaAtual) {
            opcao.classList.add('correct');
        } else {
            opcao.classList.add('wrong');
        }
        opcao.style.pointerEvents = 'none';
    });

    if (vidas <= 0 && modo === "idioma") {
        setTimeout(gameOver, 1000);
    } else {
        avancarPergunta();
    }
}

// ENTER PARA JOGAR
document.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && playSection.style.display !== 'none') {
        startGame();
    }
});

// PERGUNTAS
function mostrarPergunta() {
    if (!jogoAtivo) return;

    clearInterval(timerInterval);

    const pergunta = perguntas[indicePergunta];
    let opcoes = [];

    if (modo === "idioma") {
        titleEl.textContent = "Qual é o idioma?";
        opcoes = pergunta.opcoesIdioma;
        respostaCorretaAtual = pergunta.idioma;
    } else {
        titleEl.textContent = "Qual é a tradução?";
        opcoes = pergunta.opcoesTraducao;
        respostaCorretaAtual = pergunta.traducao;
    }

    sentenceEl.textContent = pergunta.frase;
    optionsEl.innerHTML = "";
    podeClicar = true;

    opcoes.forEach(opcao => {
        const p = document.createElement('p');
        p.textContent = opcao;
        p.classList.add('option');

        p.addEventListener('click', () => {
            if (!podeClicar || !jogoAtivo) return;

            clearInterval(timerInterval);
            podeClicar = false;

            if (opcao === respostaCorretaAtual) {
                p.classList.add('correct');
                pontos += 10;
                pointsEl.textContent = pontos;
            } else {
                p.classList.add('wrong');

                if (modo === "idioma") {
                    vidas--;
                    livesEl.textContent = vidas;
                }
            }


            document.querySelectorAll('.option').forEach(el => {
                if (el.textContent === respostaCorretaAtual) {
                    el.classList.add('correct');
                }
                el.style.pointerEvents = 'none';
            });

            if (vidas <= 0 && modo === "idioma") {
                setTimeout(gameOver, 1000);
            } else {
                avancarPergunta();
            }
        });

        optionsEl.appendChild(p);
    });

    startTimer();
}

function avancarPergunta() {
    setTimeout(() => {
        if (!jogoAtivo) return;

        if (modo === "idioma") {
            modo = "traducao";
        } else {
            modo = "idioma";
            indicePergunta++;
        }

        if (indicePergunta >= perguntas.length) {
            gameOver();
            return;
        }

        mostrarPergunta();
    }, 800);
}

function gameOver() {
    jogoAtivo = false;
    clearInterval(timerInterval);

    quizScreen.style.display = 'none';
    gameOverScreen.style.display = 'block';
    finalPointsEl.textContent = pontos;
}

restartButton.addEventListener('click', startGame);




