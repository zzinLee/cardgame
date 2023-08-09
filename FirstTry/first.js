const buttons = document.querySelectorAll('button');
const startbutton = document.querySelector('#start');
const restartbutton = document.querySelector('#restart');

//게임전 화면
const beforegame =  document.querySelector('#beforegame');

//게임중화면
const game = document.querySelector('#game');
const cardgallary = document.querySelector('#cardgallary');
const covergallary = document.querySelector('#covergallary');

//타임오버화면
const timeover = document.querySelector('#timeover');


//남은시간과 남은카드 확인
const lefttime = document.querySelector('#lefttime');
const leftcard = document.querySelector('#leftcard');

//카드 양면
const cards = cardgallary.querySelectorAll('img.card');
const covers = covergallary.querySelectorAll('img.cover');

//stack
let basket = [];
//맞는 카드 수
let matched = 0;



for(const button of buttons){
  button.addEventListener("click", gameStart);
}

function gameStart(event){
  let elem = event.target;
  if(elem.id==='start'){//start버튼
    //스타트 버튼 & 게임전화면 없애기
    elem.style.display = 'none';
    beforegame.style.display = "none";

    //리스타트 버튼 & 게임화면 오픈
    restartbutton.style.display = "";
    game.style.display = "";

    //게임시작
    turnIntoGame();
  } 

  else {//restart
    //리스타트버튼 없애기
    elem.style.display = 'none';
    //스타트버튼 오픈
    startbutton.style.display = "";
    //게임전화면 보여주기
    beforegame.style.display = "";
    //게임전화면보여주기 위해 게임화면은 우선 막아두기
    game.style.display = "none";
    //타임오버화면 막아두기
    timeover.style.display = "none";
    //커버 초기화 & 카드 보여주기(감춰진 게임화면) 
    cardgallary.style.display = "";
    covergallary.style.display = "";
    for(const cover of covers){
      cover.style.visibility = "";
    }
  }
}



function turnIntoGame(){
  //초기화
  basket = [];
  matched = 0;

  leftcard.innerHTML=`${8-matched}장`;
  //time limit
  let i = 0;
  function updatetime(){
    lefttime.innerHTML = `${35-i}초`;
    i++;
  }
  updatetime();//실행하자마자 초세기 & 초 받아적기
  const interval = setInterval(updatetime, 1000);
  
  //35초 후에 종료
  const timeOut = setTimeout(timeout,35000);
  function timeout(){//35초후에 할 일
    lefttime.innerHTML = '0초';
    //초 받아오기 stop
    clearInterval(interval);
    //게임화면 감추기
    cardgallary.style.display = "none";
    covergallary.style.display = "none";
    //타임오버 화면 보여주기
    timeover.style.display = "";
  }

  //중간에 restart누르면 시간동작 초기화
  restartbutton.addEventListener('click', function(){
    clearInterval(interval);
    clearTimeout(timeOut);
    matched = 0;
    lefttime.innerHTML = `${8-matched}장`;
  })
  
  //카드 배치
  shakingCard();
  
  //누르면 카드 뒤집기
  covergallary.addEventListener('click', flipTheCard);
  
}


function flipTheCard(event){
  const clickedcover = event.target;
  if(clickedcover.tagName !== 'IMG') return;
  clickedcover.style.visibility = "hidden";
  
  //커버와 매칭하는 카드 데려오기
  const num = +clickedcover.id.replace(/[^0-9]/g,'');
  const clickedcard = cardgallary.querySelector(`#card${num}`);
  
  //같지 않은 카드이면 다시 뒤집는다
  if(pushBasket(clickedcard)){
    for(const card of basket){//basket 안의 카드 두 개 다시 뒤집기
      setTimeout(show, 600);
      
      const n = +card.id.replace(/[^0-9]/g,'');
      function show(){
        covergallary.querySelector(`#cover${n}`).style.visibility = "visible";  
      }
    }
    basket = [];//그리고 basket 비운다. 다시 담을 것
  }
  
}

function pushBasket(card){
  //basket에 아무것도 없으면 담기 
  if(!basket.length){
    basket.push(card);
    return false;
  }
  //있으면 담기 전에 같은 이미지인지 확인 하는데,
  //같은 이미지가 아니라면 카드를 담고 true 반환
  if(basket[0].src !== card.src){
    basket.push(card);
    return true;
  }

  //같은 이미지라면, 
  //이미 있던 카드도 빼고 카드도 뒤집지 않을 것임. false반환
  //matched 카드가 하나 늘었음을 명시
  basket.pop();
  matched++;
  leftcard.innerHTML=`${8-matched}장`;

  //만약 전부 매치되었다면 게임 종료
  return false;
}

const img1 = "../img/0.png";
const img2 = "../img/1.png";
const img3 = "../img/2.png";
const img4 = "../img/3.png";
const img5 = "../img/4.png";
const img6 = "../img/5.png";
const img7 = "../img/6.png";
const img8 = "../img/7.png";

function randomBox(imgRandombox){
  let k = Math.random();
  k = Math.round((k/10) * imgRandombox.length);
  let img = imgRandombox[k];
  imgRandombox.splice(k,1);
  return img;
}

function shakingCard(){
  
  const imgRandombox = [
    img1, img2, img3, img4, img5, img6, img7, img8,
    img1, img2, img3, img4, img5, img6, img7, img8 
  ];
  
  for(const card of cards){
    card.setAttribute('src', randomBox(imgRandombox));
  }

}