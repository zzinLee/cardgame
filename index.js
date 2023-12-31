const buttons = document.querySelectorAll('button');

const startbutton = document.querySelector('#start');
const restartbutton = document.querySelector('#restart');

const beforegame = document.querySelector('#beforegame');

const game = document.querySelector('#game');
const carddeck = document.querySelector('#carddeck');
const covers = document.querySelectorAll('.coverImg');
const cards = document.querySelectorAll('.cardImg');

const lefttime = document.querySelector('#lefttime');
const leftcard = document.querySelector('#leftcard');

const timeover = document.querySelector('#timeover');
const finishedcover = document.querySelector('#finishedcover');

const COVER_CLASS = 'coverImg';

//stack
const basket = [];
let matched = 0;

for(const button of buttons){
  button.addEventListener('click', gameStart);
}

function gameStart(event){
  //버튼 클릭!
  let elem = event.target;
  
  //시작버튼클릭
  if(elem === startbutton){
    startbutton.style.display = "none";
    beforegame.style.display = "none";

    restartbutton.style.display = "";
    game.style.display = "";
    
    //게임시작
    turnIntoGame();
  }
  else { //if(elem === restartbutton) 재시작버튼 클릭
    startbutton.style.display = "";
    beforegame.style.display = "";

    restartbutton.style.display = "none";
    game.style.display = "none";

    timeover.style.display = "none";
    carddeck.style.display = "";

    finishedcover.style.display = "none";

    for(const cover of covers){
      cover.style.zIndex = 1;
    }
  }
}

function turnIntoGame(){
  //남은카드수 업데이트
  leftcard.innerHTML = `${8-matched}장`;

  //1초마다 시간체크
  let t = 0;
  const updatetime = () =>{
    lefttime.innerHTML = `${40-t}초`;
    t++;
  }
  updatetime();
  const updateTime = setInterval(updatetime, 1000);
  
  //40초 후 타임오버
  const timeout = () =>{
    clearInterval(updateTime);
    lefttime.innerHTML = '0초';
    leftcard.innerHTML = '0장';

    timeover.style.display = "";
    carddeck.style.display = "none";
  }
  const timeOut = setTimeout(timeout, 40000);

  //중간에 재시작 버튼 누르면 다시 초기화
  restartbutton.addEventListener('click',function(){
    clearInterval(updateTime);
    clearTimeout(timeOut);
    matched = 0;
    deleteBasket(basket);
  })


  //카드배치
  shakingCard();

  //카드 뒤집기
  carddeck.addEventListener('click', fliptheCard);
  
}

function fliptheCard(event){
  const clickedcover = event.target;
  if(!clickedcover.classList.contains(COVER_CLASS)) return;

  //앞면 보여주기
  clickedcover.style.zIndex = 0;

  //뒷면에 맞는 앞면 카드
  const selectedcard = clickedcover.nextElementSibling.children[0];

  if(pushBasket(clickedcover, selectedcard)){
    for(const [cover,card] of basket){
      setTimeout(showAndHide,300);
      function showAndHide(){
        cover.style.zIndex = 1;
      }
    }
    deleteBasket(basket);
  }

  //뒤집다가 ... 게임 성공!
  if(matched === 8){
    setTimeout(finishGame, 300);
    function finishGame(){
      finishedcover.style.display = "";//게임성공종료화면
      game.style.display = "none";
    }
  }
  
}

function pushBasket(cover,card){
  if(!basket.length){
    basket.push([cover,card]);
    return false;
  }
//다른이미지, 다시 뒷면으로 뒤집을 카드들 담기
  if(basket[0][1].src !== card.src){
    basket.push([cover,card]);
    return true;
  }
//같은 이미지 > 남은카드 수 갱신
  basket.pop();
  
  matched++;
  leftcard.innerHTML = `${8-matched}장`;

  return false;
}

function deleteBasket(basekt){
  while(basket.length){
    basket.pop();
  }
}

/**
 * random shaking card
 */
const img1 = "img/0.png";
const img2 = "img/1.png";
const img3 = "img/2.png";
const img4 = "img/3.png";
const img5 = "img/4.png";
const img6 = "img/5.png";
const img7 = "img/6.png";
const img8 = "img/7.png";

function randomBox(imgRandombox){
  let rand = Math.random();
  rand = Math.round((rand/10) * imgRandombox.length);
  const selectedImg = imgRandombox[rand];
  imgRandombox.splice(rand,1);
  return selectedImg;
}
function shakingCard(){
  const imgRandombox = [
    img3, img6, img7, img8, img4, img5, img1, img2,
    img1, img3, img4, img5, img6, img7, img8, img2,
  ]
  for(const card of cards){
    card.setAttribute('src', randomBox(imgRandombox));
  }
}