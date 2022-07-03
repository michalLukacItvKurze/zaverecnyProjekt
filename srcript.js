// malo by zaručiť aby bol cely dokument načitaný pred spustením 
document.addEventListener('DOMContentLoaded',()=> {
    
        playGame(); 


    function playGame(){

        // odchytim si hraciu plochu
        let gameBoard = document.getElementById('board');
        let menu = document.getElementById('menuGameOver');
        let playButton = document.getElementById('playButton');
        let playButtonW = document.getElementById('playButtonW');
        // odchytim si postavy
        let posAndGun = document.getElementById('posAndGun');
        let posRight = document.getElementById('posRight');
        //odcyhtim si poziciu postavy
        let gunRight = document.getElementById('gunRight');
        // odcyhtim si batoh
        let rocketBag = document.getElementById('rocketBag');
        // odchytim si enemies
        let enemy1 = document.getElementById('enemy1');
        let enemy2 = document.getElementById('enemy2');
        let enemy3 = document.getElementById('enemy3');
        let enemy4 = document.getElementById('enemy4');
        let enemy5 = document.getElementById('enemy5');
        
        // odchytim si strely nepriatela
        let shot1 = document.getElementById('shot1');
        let shot2 = document.getElementById('shot2');
        let shot3 = document.getElementById('shot3');
        let shot4 = document.getElementById('shot4');
        let shot5 = document.getElementById('shot5');
        // odchytim si poziciu zbrane teda prva pozicia strelca
        let rectX = 150; 
        let rectY = -6 ;
        // odchytim si poziciu strely
        let bulletsX;
        // odchytim si poziciu gule
        let balX = 0;
        let balY = 50;
        // odcyhtim si poziciu zombie
        let zombX = 0;
        let zombY = 50;

        // sounds
        let shotSound = new Audio('sounds/shot.mp3');
        let rocketSound = new Audio('sounds/rocket.mp3');
        let colisionBullet =  new Audio('sounds/colision.mp3');
        let colisionObject = new Audio('sounds/life.mp3');
        let gameOverSound = new Audio('sounds/gameover.mp3');
        let winSound = new Audio('sounds/win.mp3');
       
        //score
        let score = 0;
        let count = document.getElementById('count');
        let scoreGameover = document.getElementById('scoreGameover');
        //zivoty
        let zivoty = 4;
        //podlaha
        let bottom = 0;
        //skakanie
        let isJumping = false;
        let shooting = true;
        let shootingRight = true;
        let gravity = 1;

        // zavolanie funckie - pohyb enemies // zavolanie funckie - pohyb strely
        let enemyAr = [enemy1,enemy2,enemy3,enemy4,enemy5];
        let enemyShotAr = [shot1,shot2,shot3,shot4,shot5];
        let enemyPosAr = [900,1300,1800,2100,2800];
        let enemyShotArPos = [1100,2000,3000,3900,5100];

        for(let i = 0; i < 5; i++){
            moveEnemies(enemyAr[i],enemyPosAr[i]);
        }

                for(let i = 0; i < 5; i++){
            moveShots(enemyShotAr[i],enemyShotArPos[i]);
        }

        
        
        // key down pohyb postavicky a zbrane
        window.addEventListener('keydown',(e)=>{
            let left = parseInt(window.getComputedStyle(posAndGun).getPropertyValue('left'));
            //left
            if(e.keyCode=='37' && left > 10 ){
                //postava a zbran pohyb vlavo
                posRight.id='posRunLeft';
                posAndGun.style.left = left - 10 + 'px';
                gunRight.id='gunLeft';
                gunSide = 'left';
                rocketBag.style.left='140px';
                rectX = rectX - 10;
                rectX = parseInt(rectX);
                shootingRight = false;  
            }
            //right
            else if(e.keyCode=='39' && left <700){
                //postava a zbran pohyb vpravo
                posRight.id='posRunRight';
                gunRight.id='gunRight';
                posAndGun.style.left = left + 10 + 'px';
                gunSide = 'right';
                rocketBag.style.left='40px';
                rectX = rectX + 10;
                rectX = parseInt(rectX);
                shootingRight = true;
            }
            return rectX;
        })
        // keyUp zastavenie postavicky 
        window.addEventListener('keyup',(e)=>{
            left = parseInt(window.getComputedStyle(posAndGun).getPropertyValue('left'));
            //left
            if(e.keyCode=='37'){
                //zastavenie 
                posRight.id='posLeft';           
            }
            //right
            else if(e.keyCode=='39'){
                //zastavenie
                posRight.id='posRight';
            }
        })
        // key down skok postavicky 
        window.addEventListener('keydown', (e)=>{
            if(e.keyCode=='38'){
                jump(posAndGun);
                rocketSound.play();
            }
        })
        // key down spusti move boolet 
        window.addEventListener('keydown',(e)=>{
            if(e.keyCode==32){
                if(shooting){
                    if(shootingRight){
                        let bullet = document.createElement('div');
                        bullet.classList.add('bullet');
                        board.appendChild(bullet);
                        // zavolam funkciu move bulet
                        moveBullets(bullet,rectX);
                        shotSound.play();      
                    }
                }    
            }
        });
        // funkcia move bullets - strela
        function moveBullets(bullets,positionBullets) {
            let id = null;
            clearInterval(id);
            id = setInterval(frame,1);
            function frame() {
                if( positionBullets==0){
                    clearInterval(id);
                }
                else {
                    vodorovneStrela = positionBullets = positionBullets+2;
                    bullets.style.left = positionBullets + 'px';
                    bulletsX = parseInt(vodorovneStrela);
                    // po preteceni vymaze bulets
                    if(positionBullets>1000){
                        bullets.remove();
                    }
                }
            }
            return bulletsX;
        }
        // funkcia move enemies - pohybujuci sa zombie
        function moveEnemies(enemy,positionEnemies) {
            let id = null;
            clearInterval(id);
            id = setInterval(frame,10); 
            function frame() {
                if( positionEnemies==0){
                    clearInterval(id);
                }
                else {
                    positionEnemies= positionEnemies-0.5 ;
                    rectEnemy = enemy.style.left = positionEnemies + 'px';
                    zombX = parseInt(rectEnemy);
                    atackZombie();
                    shootdown();
                    // po preteceni vymaze nepriatelov
                    if(positionEnemies<10){
                        enemy.remove();
                    }
                }
            }
            return zombX;
        }

        // funkcia move enemy shots  -  kotulajuce gule
        function moveShots(shots,positionEnemyShot) {
            let id = null;
            clearInterval(id);
            id = setInterval(frame,1);
            function frame() {
                if( positionEnemyShot==100){
                    clearInterval(id);
                }
                else {
                    positionEnemyShot= positionEnemyShot-0.3;
                    rectEnemyShot=shots.style.left = positionEnemyShot*2 + 'px';
                    balX = parseInt(rectEnemyShot);
                    // zavolanie funkcie vyhybanie sa gulam--
                    jumpOver();
                    // po preteceni vymaze enemy shots
                    if(positionEnemyShot<10){
                        shots.remove();
 
                    }
                }
            }
            return balX;
        }

        // funkcia skakanie
        function jump(char){
            if (isJumping) return;
            let upTimerId = setInterval(function () {
            //jump down
            if (bottom > 220) {
                clearInterval(upTimerId);
                let downTimerId = setInterval(function () {
                if (bottom < 0 ) {
                    clearInterval(downTimerId);
                    isJumping = false;
                    rocketBag.style.display='none';
                    shooting = true;
                }
                rectY = bottom -= 3;
                rectY = parseInt(rectY);
                bottom = bottom * gravity;
                char.style.bottom = bottom + 'px';
                
                },20)
            }
            //jump up
            isJumping = true;
            rectY = bottom +=6;
            rectY = parseInt(rectY);
            bottom = bottom * gravity;
            char.style.bottom = bottom + 'px';
            rocketBag.style.display='block'; 
            shooting = false;
            },20)
            return rectY;
        }

        // funkcia preskakovanie guľ
        function jumpOver(){
            let vodorovnePajac = Math.round(rectX);
            let vodorovneGula = Math.round(balX);
            let vertikalnePajac = Math.round(rectY) + 56;
            let vertikalneGula =  Math.round(balY);
            
 
            if((vertikalnePajac == vertikalneGula) &&
                (vodorovnePajac == vodorovneGula)
                ){
                    banner(); // vyvolanie funkcie banera zmena zivota
                    odpocitavanieZivotov(); // vyvolanie funkcie po zrazke odrata zo zivota
                    colisionObject.play();  // vyvolanie hudba                   
            }
        }
        // funkcia utok zombikov - mne uberaju zivot 
        function atackZombie(){
            let vodorovnePajac = Math.round(rectX);
            let vertikalnePajac = Math.round(rectY) + 56;
            let vodorovneZombie = Math.round(zombX);
            let vertikalneZombie = Math.round(zombY);


            if((vertikalnePajac == vertikalneZombie) &&
                (vodorovnePajac == vodorovneZombie)
                ){
                banner(); // vyvolanie funkcie banera zmena zivota
                odpocitavanieZivotov(); // vyvolanie funkcie po zrazke odrata zo zivota
                colisionObject.play();  // vyvolanie hudba 
            }
        }

        // funcia strelba zombikov-!!! ak ho strelim zmizne ale presvitny pokracuje dalej ku mne a zoberie mi zivot--
        function shootdown(){
            let vodorovneZombie = Math.round(zombX);
            let vodorovneBulet = Math.round(bulletsX);
            
            if(vodorovneZombie == vodorovneBulet){
                crashStyle();
                colisionBullet.play();
                setTimeout(()=>{
                    scoreUp()
                },10 );
                writeScore(); 
            }
        }
        // funnkcia vybuch zombika
        function crashStyle(){
            enemy1.style.background ="url('img/crash.gif')";
            enemy1.style.backgroundSize ='contain';
            enemy1.style.backgroundRepeat ='no-repaet';
            enemy1.style.width ='400px';
            enemy1.style.height ='400px';
            setTimeout(()=>{
                enemy1.style.display = 'none';
            },1000 );   
        }
        
        // funkcia banner 
        let bannerCondition = true;
        function banner(){
            let life = document.getElementById('life1');
            if(bannerCondition){
                life.remove(-1);
                bannerCondition = false;
                setTimeout(() => {
                   bannerCondition=true;
                }, 40);
            }
        }
      
        // funkcia odpocitavanieZivotov a gameover 
        let lifeCondition = true;
        function odpocitavanieZivotov(){
            if(lifeCondition){
                zivoty -=1;
                lifeCondition = false;
                setTimeout(() => {
                   lifeCondition=true;
                }, 40);
            }
            if(zivoty <= 0 ){
                gameOverSound.play();
                fadeOutBoard();
            }
            
        }
        // funkcia zvysovanie score
        function scoreUp(){
            setTimeout(()=> {
                score +=1;
            },1000);
            if(score>=3){
                fadeOutBoardWin();
                winSound.play(); 
            }
        }
        // fade out board  - after game over
        function fadeOutBoard(){
            gameBoard.style.display='none';
            menu.style.display='block';
        }
        // fade out board  - after winner game
        function fadeOutBoardWin(){
            gameBoard.style.display='none';
            menuWin.style.display='block';
        }
        // funkcia vypisovania score 
        function writeScore(){
            count.innerHTML = '<div>' + 'SCORE ' + score + '/3' + '</div>';
            scoreGameover.innerHTML = '<div>' + score + '/3 ' + '</div>';
        }

        // klik na button spusti hru 
        playButton.addEventListener('click',(e)=>{
        // nacita na novo stranku s hrou
        location.reload();
        });
        playButtonW.addEventListener('click',(e)=>{
        // nacita na novo stranku s hrou
        location.reload();
        });

    }
    

})

