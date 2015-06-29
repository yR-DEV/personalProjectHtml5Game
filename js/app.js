
//starting and initializing the game
//according to the below link, creating these objects are essentially class definitions
//and they need to have capital names
//https://books.google.com/books?id=kzTk0kOCODEC&pg=PT161&lpg=PT161&dq=having+object+names+in+html5+game+start+with+capital+letter&source=bl&ots=5bTfurpboj&sig=YgTd11vr2b6uISvmfn_4rH-EZpQ&hl=en&sa=X&ei=64CRVeHPE4SFyQTwq7LwDg&ved=0CB8Q6AEwAA#v=onepage&q=having%20object%20names%20in%20html5%20game%20start%20with%20capital%20letter&f=false

var game = new Game();

function init() {
	if(game.init())
		game.start();
}

//creating an image object, this will house all of the images in the img folder
//and allow me to call on them in other functions

var imgDir = new function() {
  //defining the images and declaring the key empty to be null
  //because it isn't empty xD
  this.empty = null;
  //setting background to a new image
  this.background = new Image();

  //setting the image source
  this.background.src = "img/road.png";
};

//creating a new "drawable object" which will be the base class/object
//for all images and things drawn on the canvases
//child objects will inherit all of the attributes and
function Drawable() {
  //setting an initialize function for drawable objects, passing coords in
  this.init = function(x, y) {
    //defaulting the x and y cords of whichever child object was passed to drawable
    //and saving the cords that the function was passed as their location on the canvas/screen
    this.x = x;
    this.y = y;
  };

  //setting default speeds and dimensions for whichever child object
  //was passed to the drawable object
  //if I dont like these or dont want 0 for all 3in the future
  //simply redefining the values in the child object will overwrite them
  this.speed = 0;
  this.canvasHeight = 0;
  this.canvasWidth = 0;

  //abstract function to be called on from other objects and gives access to the
  //properties listed in here
  this.draw = function() {
    //going to be left blank, just going to call on it from other objects
  };
}

//creating a background object that will inherit traits from drawable object
//all of these object definitions are essentially class definitions so they
//need to start with capital letters, I HATE THIS.
function Background() {
  //redefine the speed of the background because it is going to move.
  //this declaration/redefinition overwrites the0 set in the drawable object
  this.speed = 1;

  //calling on and implementing the abstract draw function declared at the end
  //of the drawable object
  this.draw = function() {
    //moving the background
    this.x += this.speed;
    this.context.drawImage(imgDir.background, this.x, this.y);

    //drawing another image on top of the other one so the panning will look smooth
    this.context.drawImage(imgDir.background, this.x, this.y);

    //conditional checking whether or not the image has scrolled off the screen, reset
    //the image
    if(this.x >= this.canvasWidth) {
      this.x = 0;
    }
  };
}

//actually calling on the Background object to inherit properties from the
//Drawable object
Background.prototype = new Drawable();


//creating the main game object.
//It will contain all the data, objects, images, and whatnot
function Game() {
  this.init = function() {
    //getting the ID of the canvas html element on the main page
    this.backgroundCanvas = document.getElementById('backgroundCanvas');
    //conditional testing whether or not that the canvas html5 element is supported
    //by the users browser
    if(this.backgroundCanvas.getContext) {
      this.backgroundContext = this.backgroundCanvas.getContext('2d');
      //initializing objects to contain their canvas location and context
      Background.prototype.context = this.backgroundContext;
      Background.prototype.canvasHeight = this.backgroundCanvas.height;
      Background.prototype.canvasWidth = this.backgroundCanvas.width;
      //init on the background object, setting its draw point to cords (0,0)
      //this is basically calling on the init function in drawable object
      this.background = new Background();
      this.background.init(0, 0);
      return true;
    } else {
      return false;
    }
  };

  //initializing the animation loop
  this.start = function() {
    animate();
  };
}

//creating the animation loop, calling on the requestAnimationFrame from the API
//by a front end developer named Paul Irish and is what the above this.start calls on
function animate() {
  requestAnimFrame( animate );
  game.background.draw();
}


//the animation API mentioned above created by the front end dev Paul Irisj
window.requestAnimFrame = (function(){
	return  window.requestAnimationFrame       ||
			window.webkitRequestAnimationFrame ||
			window.mozRequestAnimationFrame    ||
			window.oRequestAnimationFrame      ||
			window.msRequestAnimationFrame     ||
			function(/* function */ callback, /* DOMElement */ element){
				window.setTimeout(callback, 1000 / 60);
			};
})();
