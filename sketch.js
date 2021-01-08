
//Create variables here
var dog;
var dogImg;
var happyDog;
var database;
var foodS;
var foodStock;
var feedButton,addButton;
var fedTime,lastFed;
var foodObj = null;

function preload()
{
  //load images here
  dogImg = loadImage("Dog.png");
  happyDog = loadImage("happydog.png");

}

function setup() {
  database = firebase.database();
  createCanvas(800, 500);
  dog = createSprite(500,250);
  dog.addImage(dogImg);
  dog.scale=0.15;

  foodStock=database.ref('Food');
  foodStock.on("value",readStock);

  feedButton = createButton("Feed your dog");
  feedButton.position(700, 95);
  feedButton.mousePressed(feedDog);

  addButton = createButton("Buy Milk Bottles");
  addButton.position(820, 95);
  addButton.mousePressed(addFood);

  foodObj = new Food();
}


function draw() {  
  background(46, 139, 87);
  
  fedTime=database.ref('lastFed'); 
  fedTime.on("value",function(data){ 
    lastFed=data.val(); 
  });

  if(lastFed>=12){
    text("Last Fed (approx timing) : "+ lastFed%12 + " PM", 350,30);
   }else if(lastFed==0){
     text("Last Fed (approx timing)  = 12 AM",350,30);
   }else{
     text("Last Fed (approx timing)  = "+ lastFed + " AM", 350,30);
   }

  drawSprites();
  //add styles here
  stroke("black");
  text("Food remaining : "+foodS,450,190);

  foodObj.display();
}

//increment foodS, updateFoodStock using foodS
function addFood(){
  foodS++;
  foodObj.updateFoodStock(foodS);
}


//change dog image, deduct foodS, updateFoodStock using foodS, set lastFed
function feedDog(){
  if(foodS > 0){
    dog.addImage(happyDog);
    foodS--;
    foodObj.updateFoodStock(foodS);
    lastFed = hour();
    foodObj.updateLastFed(lastFed);
  }
}

function readStock(data){
  foodS=data.val();
}

function writeStock(x){
  if(x<=0){
    x=0;
  }else{
    x=x-1;
  } 
  database.ref('/').update({
    Food:x
  })
}
