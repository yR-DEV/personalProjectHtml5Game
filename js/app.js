
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
  this.biker = new Image();
  this.uLock = new Image();
	this.enemy1 = new Image();
	// this.enemy2 = new Image();
	// this.enemy3 = new Image();
	// this.enemy4 = new Image();


  //double checking to tell whether or not the images are present and loaded
  //I want to not run the game if there are images missing or broken.
  var imgCount = 4;
  var imgLoaded = 0;
  //the function to check the number of loaded images.
  //the window will not initialize unless there are the correct # of imgs
  function imageLoader() {
    imgLoaded++;
    if(imgLoaded === imgCount) {
      //if all three images are present, not broken, and loading,
      //then the window will initialize
      window.init();
    }
  }
  //These call on the function above, once the image has been loaded,
  //they will be passed to the above function, increasing the counter of the images loaded
  this.background.onload = function() {
    imageLoader();
  }
  this.biker.onload = function() {
    imageLoader();
  }
  this.uLock.onload = function() {
    imageLoader();
  }
	this.enemy1.onload = function() {
		imageLoader();
	}
	// this.enemy2.onload = function() {
	// 	imageLoader();
	// }
	// this.enemy3.onload = function() {
	// 	imageLoader();
	// }
	// this.enemy4.onload = function() {
	// 	imageLoader();
	// }


  //setting the image source
  this.background.src = "img/road.png";
  this.biker.src = "img/car.png";
  this.uLock.src = "img/bullets.png";
	this.enemy1.src = "img/car2.png";

};

//creating a new "drawable object" which will be the base class/object
//for all images and things drawn on the canvases
//child objects will inherit all of the attributes and
function Drawable() {
  //setting an initialize function for drawable objects, passing coords in
  this.init = function(x, y, width, height) {
    //defaulting the x and y cords of whichever child object was passed to drawable
    //and saving the cords that the function was passed as their location on the canvas/screen
    this.x = x;
    this.y = y;
    //also setting the default height and width that are passed to this function
    this.width = width;
    this.height = height;
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
  //defining another abstract function to be used by the child objects
  //will be called on from child objects
  this.move = function() {
    //this will be left blank and will be called on in other objects to inherit
    //their properties
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

    //drawing another image on top of the edge of the other one so the panning will look smooth
    this.context.drawImage(imgDir.background, this.x - this.canvasWidth, this.y);

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

//creating a ulock object which will contain all the data for the ulocks
//that originate from the biker, they will be drawn on the focus canvas
function ULock() {
  //if the bullet is live and drawn on the canvas then this will return true;
  this.alive = false;

  //setting the bullet values
  //x,y and speed. Firty Rectangles too
  this.spawn = function(x, y, lockSpeed) {
    this.x = x;
    this.y = y;
    this.speed = lockSpeed;
    this.alive = true;
  };
     //Now for dirty rectangles, the canvas is basically drawing each bullet again
     //as they move frame by frame accross the stage calling on draw from the drawable object
     //to give it movement and information
  this.draw = function() {
    this.context.clearRect(this.x, this.y, this.width, this.height);
    this.y -= this.speed;
    if(this.y <= 0 - this.height) {
      return true;
    } else {
      this.context.drawImage(imgDir.uLock, this.x, this.y);
    }
  };

  //resetting the bullet values when they are cleared from the canvas
  this.clear = function() {
    this.x = 0;
    this.y = 0;
    this.speed = 0;
    this.alive = false;
  };
}

// //gotta call on the drawable object and draw the bullets
// //the bullets will inherit the drawable object's properties
// //unless they are overwritten
ULock.prototype = new Drawable();

//creating an object that will hold all the bullets on the canvas and get rid of them
//when needed. The pool populates an array with bullet objects,
//when pool needs to create a new object, checks to see if last obj in array
//is on or off the screen(or in use or not in use), if last obj isnt in use pool spawns
//the last item in the array and pushes it to the front this way there are free objects on the back
//and in use objects in the front of the array. If an obj is in use, the pool will redraw ulock
//if draw function returns true then it is time to remove item from the array and push it to the back
function ULockPool(maxLength) {
  //This is the maximum number of bullets allowed on the canvas and in the array
  var arraySize = maxLength;
  var arrayPool = [];

  //populating the pool with the ulock object
  this.init = function() {
    //setting a loop to go through the array of the number of bullets allowed on the canvas
    for(var i = 0; i < arraySize; i++) {
      var uLock = new ULock();
      uLock.init(0,0, imgDir.uLock.width, imgDir.uLock.height);
      arrayPool[i] = uLock;
    }
  };

  //taking the last item in the array (which should be non alive bullet)
  //and pushing it to the front of the array so it can be used
  this.get = function(x, y, theSpeed) {
    if(!arrayPool[arraySize - 1].alive) {
      arrayPool[arraySize - 1].spawn(x, y, theSpeed);
      arrayPool.unshift(arrayPool.pop());
    }
  };

  this.getTwo = function(x1, y1, speed1, x2, y2, speed2) {
    if(!arrayPool[arraySize - 1].alive &&
       !arrayPool[arraySize - 2].alive) {
        this.get(x1, y1, speed1);
        this.get(x2, y2, speed2);
       }
  };

  //drawing any bullets that are currently on the canvas
  //once a bullet goes off the screen it gets cleared and pushed to the front of the array
  this.animate = function() {
    //in this for loop we will be checking the array
    //and only drawing a bullet that is !alive
    for(var i = 0; i < arraySize; i++) {
      if(arrayPool[i].alive) {
        if(arrayPool[i].draw()) {
          arrayPool[i].clear();
          arrayPool.push((arrayPool.splice(i, 1))[0]);
        }
      } else {
        break;
      }
    }
  };
}

//creating the bike player that the user controls
//it is drawn on the player canvas, dirty rectangles move it around screen
//with the user input
function Biker() {
  //setting default values, speeds, and pool size
  this.speed = 3;
  this.uLockPool = new ULockPool(35);
  this.uLockPool.init();
  //setting the firing rate and the counter of bullets
  var throwingRate = 15;
  var counter = 0;
  //gotta draw the bike on the canvas
  this.draw = function() {
    this.context.drawImage(imgDir.biker, this.x, this.y);
  };
  //calling on the move abstract to actually move when keys are pressed
  //will be (almost like) an event listener, listening for key pressed
  this.move = function() {
    counter ++;

    if (KEY_STATUS.left || KEY_STATUS.right || KEY_STATUS.down || KEY_STATUS.up) {
      //if a key is pressed, that means that it is time to move, clear, and redraw the biker
      this.context.clearRect(this.x, this.y, this.width, this.height);
      //gotta update the x and y according to user input
      if(KEY_STATUS.left) {
        this.x -= this.speed;
        //checking whether or not that the player is near or off the canvas/screen
        if(this.x <= 0) {
          this.x = 0;
        }
      } else if(KEY_STATUS.right) {
        this.x += this.speed;
        //checking the same thing on the other side of the screen, subtracting the width of
        //the biker image with the width so he stops at the edge and isn't hanging off
        if(this.x >= this.canvasWidth - this.width) {
          this.x = this.canvasWidth - this.width;
        }
      } else if(KEY_STATUS.up) {
        this.y -= this.speed;
        //setting limits on how far foward the bike can go on the screen
        if(this.y >= this.canvasHeight +500) {
          this.y = this.canvasHeight +500;
        }
      } else if(KEY_STATUS.down) {
        this.y += this.speed;
        //setting limits on how far down, which isn't really limited except by the
        //dimensions of the canvas
        if(this.y >= this.canvasHeight - this.height) {
          this.y = this.canvasHeight - this.height;
        }
      }
      //finish this be redrawing the biker!
      this.draw();
    }

    if(KEY_STATUS.space && counter >= throwingRate) {
      this.throw();
      counter = 0;
    }
  };

  this.throw = function() {
    this.uLockPool.getTwo(this.x + 6, this.y, 3, this.x + 32, this.y, 3);
  };
}
//gotta set the biker as a new Drawable to inherit the characteristics from that object
Biker.prototype = new Drawable();

function Enemy1() {
	this.alive = false;

	this.spawn = function(x, y, theSpeed) {
		this.x = x;
		this.y = y;
		this.speed = theSpeed;
		this.speedX = 0;
		this.speedY = theSpeed;
		this.alive = true;
		this.leftEdge = this.x - 90;
		this.rightEdge = this.x + 90;
		this.bottomEdge = this.y + 140;
  };

	this.draw = function() {
    this.context.clearRect(this.x-1, this.y, this.width+1, this.height);
    this.y += this.speedY;
		this.x += this.speedX;
    if(this.y <= 0 - this.height) {
      return true;
    } else {
			//this is where it is drawn. DRAWIMAGE FOR GODS SAKE.
      this.context.drawImage(imgDir.enemy1, 200, 200);
    }
  };
}

Enemy1.prototype = new Drawable();

//creating the main game object.
//It will contain all the data, objects, images, and whatnot
function Game() {
  this.init = function() {
    //getting the ID of the canvas html element on the main page
    this.backgroundCanvas = document.getElementById('backgroundCanvas');
    this.bikeCanvas = document.getElementById('bikeCanvas');
    this.mainCanvas = document.getElementById('mainCanvas');
    //conditional testing whether or not that the canvas html5 element is supported
    //by the users browser
    if(this.backgroundCanvas.getContext) {
      this.backgroundContext = this.backgroundCanvas.getContext('2d');
      this.bikeContext = this.bikeCanvas.getContext('2d');
      this.mainContext = this.mainCanvas.getContext('2d');
      //initializing background objects to contain their canvas location and context
      Background.prototype.context = this.backgroundContext;
      Background.prototype.canvasHeight = this.backgroundCanvas.height;
      Background.prototype.canvasWidth = this.backgroundCanvas.width;
      //init'ing the biker canvas
      Biker.prototype.context = this.bikeContext;
      Biker.prototype.canvasHeight = this.bikeCanvas.height;
      Biker.prototype.canvasWidth = this.bikeCanvas.width;
      //initializing the main canvas
      ULock.prototype.context = this.mainContext;
      ULock.prototype.canvasHeight = this.mainCanvas.height;
      ULock.prototype.canvasWidth = this.mainCanvas.width;

			Enemy1.prototype.context = this.mainContext;
      Enemy1.prototype.canvasHeight = this.mainCanvas.height;
      Enemy1.prototype.canvasWidth = this.mainCanvas.width;
      //init on the background object, setting its draw point to cords (0,0)
      //this is basically calling on the init function in drawable object
      this.background = new Background();
      this.background.init(0, 0);  //draw point is at x = 0 and y = 0;
      //need to initialize the Biker Object now
      this.biker = new Biker();
			this.enemy1 = new Enemy1();
      //setting the biker to start at the bottom middle of the screen
      var bikerStartX = this.bikeCanvas.width / 2 - imgDir.biker.width;
      var bikerStartY = this.bikeCanvas.height / 4 * 4.25 - imgDir.biker.height * 2;
      this.biker.init(bikerStartX, bikerStartY, imgDir.biker.width, imgDir.biker.height);

			this.enemy1.init(0, 0, imgDir.enemy1.width, imgDir.enemy1.height);

		  //returns true because the biker was drawn
      return true;
    } else {
      return false;
    }
  };

  //initializing the animation loop
  this.start = function() {
    //drawing the biker...
    this.biker.draw();
		this.enemy1.draw();
    animate();
  };
}

//creating the animation loop, calling on the requestAnimationFrame from the API
//by a front end developer named Paul Irish and is what the above this.start calls on
function animate() {
  requestAnimFrame( animate );
  game.background.draw();
  game.biker.move();
  game.biker.uLockPool.animate();
}

// //making an object of the key codes that will be recorded and mapped when
// //the user presses a valid key
KEY_CODES = {
  32: 'space',
  37: 'left',
  38: 'up',
  39: 'right',
  40: 'down',
};

//setting the default for the key codes to remain false
//this is a quick way to check whether or not they ahve been pressed, when they are pressed
//they will read true in the key status object
KEY_STATUS = {};
for(key in KEY_CODES) {
  KEY_STATUS[KEY_CODES[key]] = false;
}
//setting the entire document to listed to key events.
//this watches for keydown events. Instead of watching for key up, watching for
//keydown lets the user press and hold a key to move consistently in one direction
document.onkeydown = function(key) {
  //firefox uses charCode instead of keyCode so we have to use one of those
  //fancy conditionals to check the key code
  var keyCode = (key.keyCode) ? key.keyCode: key.charCode;
  if(KEY_CODES[keyCode]){
    key.preventDefault();
    //turning the status of the keystatus object to true, indicating that a button
    //was pressed by the user
    KEY_STATUS[KEY_CODES[keyCode]] = true;
  }
};
//Also going to listen for the on key up events at the same time
//this will be like okay, the user prssed the key for this long, this is
//how long we are going to move. It will set the key code key value pair
//in the array to false when the user lets go of a key they were holding down
document.onkeyup = function(key) {
  //same as above, adding support for firefox's charCode
    var keyCode = (key.keyCode) ? key.keyCode: key.charCode;
    if(KEY_CODES[keyCode]) {
      key.preventDefault();
      KEY_STATUS[KEY_CODES[keyCode]] = false;
    }
};


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
