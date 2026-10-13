// document.addEventListener('click', () => {
//     alert("Você clicou na página!")
// })
document.addEventListener('DOMContentLoaded', () => {
    const mario = document.querySelector ('.mario');
    const pipe = document.querySelector('.pipe');
    const gameBoard = document.getElementsById ('game-board');
    const hudPlayerName = document.getElementsById ('hud-player-name');
    const escoreDisplay = document.getElementsById ('score-display'); 
    const jumpTip = document.getElementById ('jump-tip');
    const startModal = document.getElementById ('start-modal');
    const startForm = document.getElementById ('start-form');
    const playerInput = document.getElementById ('player-input');
})
// ELEMENTOS DO JOGO

    const startModal = document.getElementById ('start-modal');
    const startForm = document.getElementById ('start-form');
    const playerInput = document.getElementById ('player-input');
    const btnView = document.getElementById ('btn-view-ranking');
    const gameoverModal = document.getElementById ('final-score-value');
    const finalScoreValue = document.getElementById ('final-score-value');
    const saveStatusMsg = document.getElementById ('ranking-body');
    const btnRestart = document.getElementById ('btn-restart');
    const btnChangePlayer = document.getElementById ('btn-change-player');

    let currentPlayer ='';
    let score = 0;
    let isPlaying = false;
    let gameLoop = null;
    let scoreLoop = null;
    // RECUPERAÇÃO DO ULTIMO NOME DE USUÁRIO UTILIZADO 
    const savedName = localStorage.getItem ('mario_jump_player');
    if(savedName && playerInput){
        playerInput.value = savedName;
    }
    
    function startGame(){
        // limpei loops anteriores se existirem
        clearInterval(gameLoop);
        clearInterval(scoreLoop);
        // resetei as posições visuais
        resetElements();
        isPlaying = true;
        score = 0;
        scoreDisplay.textContent = 0;
        hudPlayerName.textContent = currentPlayer || 'Jogador';

        // Ativa as animações CSS do jogo
        gemeBoard.classList.add('running');
        // loop de pontuação progressiva, 1ponto a cada 100 ms
        scoreLoop = setInterval(() => {
            if(isPlaying){
                score += 1;
                scoreDisplay.textContent = score;
            }
        },100 );

        // loop de colisãoss
        gameLoop = setInterval(checkCollision, 10);
    }
    // resetar os estilos e posições do mario e o obstáculo
    function resetElements(){
        // reseta o cano (obstáculo)
        pipe.style.animation = '';
        pipe.style.left = '';
        
        // reset do mario
        mario.src = '../assets/mario.gif';
        mario.style.animation = '';
        mario.stayle.bottom = '0px';
        mario.style.whidth = '';
        mario.style.marginLeft = '';
        mario.classList.remove ('jump');
        if(jumpTip){
        jumpTip.style.opacity = '1';
        }
    }
    // executa o pulo do mário
    function jump(){
        if(!isPlaying) return;
        if (mario.classList.contains('jump')) return;
        
        mario.classList.add('jump');

        if(jumpTip){
            jumpTip.style.opacity='0';
        }
        setTimeout(() => {
            mario.classList.remove('jump');
        },500);
    }
// verificar a colisão entre o mário e do obstáculo
    function checkCollision(){
        if(!isPlaying)return;
        const pipePosition = pipe.offsetLeft;
        const marioPosition = +window.getComputedStyle(mario).bottom.replace('px','');
        // tolerência de colisão; quanod o cano está na faixa de contato com o mário 
        if(pipePosition <= 120 && pipePosition > 0 && marioPosition <80){
            triggerGameover(pipePosition, marioPosition);
        }
    }

        // trata o Game over
    function triggerGameover(pipePosition, marioPosition){
        isPlaying = false;
        clearInterval(gemeloop);
        clearInterval(scoreloop);
        // remover a classe running para parar as animações
        gameBoard.classList.remove('running');
        // Congela o cano na posição exata da colisão
        pipe.style.animation = 'none'
        pipe.style.left = `${pipePosition}px`;
        // congela o mário na posição exatada emuda para a imagem de Game Over
        mario.style.animation = 'none';
        mario.style.bottom = `${marioPosition}px`;
        mario.src = '../assets/game-over.png';
        mario.style.whidth = '75px';
        mario.style.marginLeft = '50px';
        // atualização do modal de Gamer Over
        finalScoreValue.textContent = score;
        saveStatusMsg.textContent = 'Salvando pontuação no banco...';
        saveStatusMsg.style.color = '#ffcc00';

        gameoverModal.classList.add('active');
        // salva a pontuação no banco com a função criada chamada saveScore
        saveScore(currentPlayer, score);
    }

    function saveScore(playerName, finalScore){
        fetch('salvar_ranking.php',{
            method: 'POST',
            headers: {
                'Content-Type': 'Aaplication/json'
            },
            body: JSON.stringify({
                nome: playerName,
                pontos: finalScore
            })
        })
        .then(res => res.json())
        .then(data => {
            if(data.status === 'sucess'){
                saveStatusMsg.textContent = 'Pontuação registradab no banco!';
                saveStatusMsg.style.color = '#10b981';
                if(data.ranking){
                    renderRanking(data.ranking, playerName, finalScore);
                }
            } else {
                saveStatusMsg.textContent = (data.message || 'Erro ao registrar.');
                saveStatusMsg.style.color = '#ef4444';
            }
        })
        .catche(err => {
            console.error('Erro na requisição', err);
            saveStatusMsg.textContent='Erro ao conectar ao servidor.';
            saveStatusMsg.style.color = '#ef4444';
        });
        
    }
    // busca no ranking atualizado no banco
    function fetchRanking(){
       fetch('obter_ranking.php')
       .then(res => res.json())
       .then(data => {
        if(data.status === 'sucess' && data.ranking){
            renderRanking(data.ranking);

        }
       })
       .catch(err => console.error('Erro ao buscar o ranking', err));
    }
    // vamos atualizar a tabela do ranking no HTML
    function renderRanking(list, highlightName = null, highlightScore = null){
        if(!rankingBody) return;
        rankingBody.innerHTML = '';
        if(!lis || list.length ===0){
            rankingBody.innerHTML = `<tr><td colspan="3" class="loading-cell">Nenhuma Pontuação Gravada Ainda</td></tr>`
            return;
        }
        let = highlightted = false;

        list.forEach((item, index)=>{
            const tr= document.createElement('tr');

            if(!highlightted && highlightName && item.nome === highlightName && parseInt (item.pontos,10)=== highlightScore){
                tr.classList.add('highligth-current');
                highlightted =true;
            }
            let medal = `${index + 1}º`;
            if(index ===0) medal = '🥇 1º';
            else if (index ===1) medal = '🥈 2º';
            else if (index === 2) medal = '🥉 3º';

            tr.innerHTML = `
            <td class="ranking-pos"> ${medal}</td>
            <td><strog>${escapeHtml(item.nome)}</strong></td>
            <td>${parseInt(item.pontos, 10)}pts</td>`;

            rankingBody.appendChild(tr);
        });
    }

    function scapeHtml(str){
        if(!str)return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;')
    }
    // evenntos de controle e interface do jogo
    // iniciar o jogo (FORMULÁRIO)
    startForm.addEventListener('submit', (e) =>{
         e.preventDefault();//Impede o recarregamento da página

         const nameValue = playerInput.value.trim();
         if(!nameValue){
            playerInput.focus();
            return;
         }
         currentPlayer = nameValue;
         localStorage.setItem('mario_jump_player', currentPlayer);
        //  fecha a tela e começa o jogo depois de preencher os dados
         startModal.classList.remove('active');
         startGame();
    });
    // botão ver ranking