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

let pontos = 0;
let vidas = 3;
let jogoAtivo = true;
let indicePergunta = 0;
let modo = "idioma";
let podeClicar = true;

// Botão JOGAR
function startGame() {
    pontos = 0;
    vidas = 3;
    indicePergunta = 0;
    modo = "idioma";
    jogoAtivo = true;

    pointsEl.textContent = pontos;
    livesEl.textContent = vidas;

    playSection.style.display = 'none';
    quizScreen.style.display = 'block';

    mostrarPergunta();
}

playButton.addEventListener('click', startGame);

// Enter para jogar
document.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && playSection.style.display !== 'none') {
        startGame();
    }
});

function mostrarPergunta() {
    if (!jogoAtivo) return;

    const pergunta = perguntas[indicePergunta];

    let opcoes;
    let respostaCorreta;

    if (modo === "idioma") {
        titleEl.textContent = "Qual é o idioma?";
        opcoes = pergunta.opcoesIdioma;
        respostaCorreta = pergunta.idioma;
    } else {
        titleEl.textContent = "Qual é a tradução?";
        opcoes = pergunta.opcoesTraducao;
        respostaCorreta = pergunta.traducao;
    }

    sentenceEl.textContent = pergunta.frase;
    optionsEl.innerHTML = "";
    podeClicar = true;

    opcoes.forEach((opcao) => {
        const p = document.createElement('p');
        p.textContent = opcao;
        p.classList.add('option');

        p.addEventListener('click', () => {
            if (!podeClicar || !jogoAtivo) return;

            if (opcao === respostaCorreta) {
                p.classList.add('correct');
                pontos += 10;
                pointsEl.textContent = pontos;
            } else {
                p.classList.add('wrong');
                vidas--;
                livesEl.textContent = vidas;

                if (vidas <= 0) {
                    gameOver();
                    return;
                }
            }

            document.querySelectorAll('.option').forEach((el) => {
                if (el.textContent === respostaCorreta) {
                    el.classList.add('correct');
                }
            });

            podeClicar = false;

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

                restartButton.addEventListener('click', () => {
                    gameOverScreen.style.display = 'none';
                    startGame();
                });

                mostrarPergunta();
            }, 800);
        });

        optionsEl.appendChild(p);
    });
}

function gameOver() {
    jogoAtivo = false;
    quizScreen.style.display = 'none';
    gameOverScreen.style.display = 'block';
    finalPointsEl.textContent = pontos;
}

