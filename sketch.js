var trex, trex_running,trexCollide, edges;
var groundImage, ground;
var invisibleGround;
var clouds,cloudImage;
var obstacles,obstacle1,obstacle2,obstacle3,obstacle4,obstacle5,obstacle6;
var score=0;
var PLAY=1;
var END=0;
var gameState=PLAY;
var obstaclesGroup, cloudsGroup;
var restart,restartImage, gameOver,gameOverImage;
var checkpointSound,dieSound,jumpSound;
function preload(){
  trex_running =loadAnimation("trexrealista1.png","trexrealista2.png","trexrealista3.png","trexrealista4.png","trexrealista5.png");
  trexCollided=loadAnimation("trexespantado.png");
  
  groundImage =loadImage("ground2-1.png");
  
  cloudImage=loadImage("nube.png");
  
  obstacle1=loadImage("cactus1.png");
  obstacle2=loadImage("cactus2.png");
  obstacle3=loadImage("cactus3.png");
  obstacle4=loadImage("cactus4.png");
  obstacle5=loadImage("cactus5.png");
  obstacle6=loadImage("cactus6.png");
  
  restartImage=loadImage("restart.png");
  gameOverImage=loadImage("gameOver.png");
  
  checkpointSound=loadSound("checkPoint.mp3");
  dieSound=loadSound("die.mp3");
  jumpSound=loadSound("jump.mp3");
}

function setup(){
  
      createCanvas(windowWidth,windowHeight);
      //invisibleGround
      invisibleGround=createSprite(width/2,height-10,width,125);
      invisibleGround.visible=false;
      
      //crea el Trex
      trex = createSprite(50,height-70,20,50);
      trex.addAnimation("running", trex_running);
      trex.addAnimation("collied",trexCollided);
      trex.setCollider("circle",100,0,100);
      trex.debug=false;
      
      ground=createSprite(width/2,height-60,width,125);
      ground.addImage("ground",groundImage);
       
      edges = createEdgeSprites(); 

      //añade escala y posición al Trex
      trex.scale = 0.12;
      trex.x = 50;
      //agregando grupos
      obstaclesGroup=new Group();
      cloudsGroup=new Group();
  
      restart=createSprite(width/2,height/2+70,50,50);
      restart.addImage("restart_Image",restartImage);
      restart.visible=false;
      restart.scale=0.5;
      gameOver=createSprite(width/2,height/2,50,50);
      gameOver.visible=false;
      gameOver.scale=0.5;
      gameOver.addImage("gameOver_Image",gameOverImage);
}


function draw(){
  
      //establece un color de fondo 
      background("lightblue");
      text("score "+score,500,20);
      

      if(gameState==PLAY){
        
        //puntuación
        
        score=score+Math.round(getFrameRate()/60);
        
        //piso en movimiento
        
          
        ground.velocityX=-4-score/100; 
          
        //piso se repite 
        
        if(ground.x<0){

                ground.x=200
          }
        
        //gravedad
        
        trex.velocityY = trex.velocityY + 1;
          
        //salta cuando se presiona la barra espaciadora
          
        if(touches.length<0||keyDown("space")&&trex.y>=height-120){
                jumpSound.play();
                trex.velocityY = -15;
                touches=[];
          }
            spawnClouds();
            spawnObstacles();
            if(obstaclesGroup.isTouching(trex)){
              gameState=END;
            }
            if(score>0&&score%100==0){
              checkpointSound.play();
              
            }
      }
      else if(gameState==END){
        trex.velocityY=0;
        ground.velocityX=0;
        obstaclesGroup.setVelocityXEach(0);
        obstaclesGroup.setLifetimeEach(-1);
        cloudsGroup.setVelocityXEach(0);
        cloudsGroup.setLifetimeEach(-1);
        trex.changeAnimation("collied",trexCollided);
        dieSound.play();
        restart.visible=true;
        gameOver.visible=true;
        
        if(touches.length<0||mousePressedOver(restart)){
          reset();
          touches=[];
        }
      }
      
      

      //evita que el Trex caiga
      trex.collide(invisibleGround);
      
      drawSprites();
}
function reset(){
  gameState=PLAY;
  obstaclesGroup.destroyEach(0);
  cloudsGroup.destroyEach(0);
  trex.changeAnimation("running",trex_running);
  restart.visible=false;
  gameOver.visible=false;
  score=0;
}
function spawnClouds(){
  if(frameCount%60==0){
    clouds=createSprite(600,height+50,20,20);
    clouds.scale=0.5;
    clouds.addImage("cloud_Image",cloudImage);
    clouds.velocityX=-3-score/100;
    clouds.y=random(height-200,height-600);
    clouds.depth=trex.depth;
    trex.depth=trex.depth+1;
    cloudsGroup.add(clouds);
    clouds.lifetime=200;
     }
}
function spawnObstacles(){
  if(frameCount%150==0){
    obstacles=createSprite(width,height-70,width,125);
    obstacles.scale=0.3;
    obstacles.velocityX=-4-score/100;
    var rand=Math.round(random(1,6));
    switch(rand){
      case 1:obstacles.addImage(obstacle1);
        break;
        case 2:obstacles.addImage(obstacle2);
        break;
        case 3:obstacles.addImage(obstacle3);
        break;
        case 4:obstacles.addImage(obstacle4);
        break;
        case 5:obstacles.addImage(obstacle5);
        break;
        case 6:obstacles.addImage(obstacle6);
      default:break;
    }
    obstacles.depth=trex.depth;
    trex.depth=trex.depth+1;
    obstaclesGroup.add(obstacles);
    obstacles.lifetime=200;
  }
}

