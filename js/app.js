
//starting and initializing the game
//according to the below link, creating these objects are essentially class definitions
//and they need to have capital names
//https://books.google.com/books?id=kzTk0kOCODEC&pg=PT161&lpg=PT161&dq=having+object+names+in+html5+game+start+with+capital+letter&source=bl&ots=5bTfurpboj&sig=YgTd11vr2b6uISvmfn_4rH-EZpQ&hl=en&sa=X&ei=64CRVeHPE4SFyQTwq7LwDg&ved=0CB8Q6AEwAA#v=onepage&q=having%20object%20names%20in%20html5%20game%20start%20with%20capital%20letter&f=false

var game = new Game();

function init() {
	game.init();
}

//creating an image object, this will house all of the images in the img folder
//and allow me to call on them in other functions

var imgDir = new function() {
  //defining the images and declaring the key empty to be null
  //because it isn't empty xD
  // this.empty = null;
  //setting background to a new image
  this.background = new Image();
  this.biker = new Image();
  this.uLock = new Image();
  this.enemy1 = new Image();
  this.enemyAmmo = new Image();


  //double checking to tell whether or not the images are present and loaded
  //I want to not run the game if there are images missing or broken.
  var imgCount = 5;
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
  };
  this.biker.onload = function() {
    imageLoader();
  };
  this.uLock.onload = function() {
    imageLoader();
  };
  this.enemy1.onload = function() {
    imageLoader();
  }
  this.enemyAmmo.onload = function() {
    imageLoader();
  }


  //setting the image source
  this.background.src = "img/road.png";
  this.biker.src = "img/car.png";
  this.uLock.src = "img/bullets.png";
  this.enemy1.src = "img/enemy.png";
  this.enemyAmmo.src = "img/enemyAmmo.png";
}

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
	this.canCollideWith = "";
	this.isCollidingBool = false;
	this.type = "";

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
	//abstract function that returns what can be collidable with what
	//and the objects type which current is an empty starting
	//but will be passed other strings as well
	this.canCollideWith = function(object) {
		return (this.canCollideWith === object.type);
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
function ULock(object) {
  //if the bullet is live and drawn on the canvas then this will return true;
  this.alive = false;
  //setting a variable to the object passed to this function
  var passedObject = object;

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
    this.context.clearRect(this.x - 2, this.y - 2, this.width + 4, this.height + 4);
    this.y -= this.speed;
    //this mutilayers conditional checks to see if whatever is being drawn is
    //the user's ammo or the enemy car's ammo
		//checking the boolean of collidable
		if(this.isCollidingBool){
			return true;
		} else if (passedObject === "uLock" && this.y <= 0 - this.height) {
			return true;
		} else if (passedObject === "enemyAmmo" && this.y >= this.canvasHeight) {
			return true;
		} else {
				if(passedObject === "uLock") {
					this.context.drawImage(imgDir.uLock, this.x, this.y)
				} else if (passedObject === "enemyAmmo") {
					this.context.drawImage(imgDir.enemyAmmo, this.x, this.y)
				}
				return false;
		}
  };


  //resetting the bullet values when they are cleared from the canvas
  this.clear = function() {
    this.x = 0;
    this.y = 0;
    this.speed = 0;
    this.alive = false;
		this.isCollidingBool = false;
  };
}

// //gotta call on the drawable object and draw the bullets
// //the bullets will inherit the drawable object's properties
// //unless they are overwritten
ULock.prototype = new Drawable();

//time to make the quad tree for collision detection.
//source for learning about this: http://gamedevelopment.tutsplus.com/tutorials/quick-tip-use-quadtrees-to-detect-likely-collisions-in-2d-space--gamedev-374
//starting in the top right of box thats split into 4 quads

//  1  |  0
// ----+----
//  2  |  3

function QuadTree(boxBoundaries, level) {
	var maxObjectsPerSquare = 10;
	this.bounds = boxBoundaries || {
		x: 0,
		y: 0,
		height: 0,
		width: 0
	};
	var objectArr = [];
	this.nodeArr = [];
	var userLevel= level || 0;
	var maximumLevels = 5;

	//clearing the quardrants and nodes of the objects
	this.clear = function() {
		objectArr = [];

		//loop to cycle through the array and remove objects
		for(var i = 0; i < this.nodeArr.length; i++){
			this.nodeArr[i].clear();
		}

		this.nodeArr = [];
	};

	//getting all the objects in the quad tree
	this.getAllObjects = function(objectsReturned) {
		for (var i = 0; i < this.nodeArr.length; i++) {
			this.nodeArr[i].getAllObjects(objectsReturned);
		}

		for(var i = 0, length = objectArr.length; i < length; i++) {
			objectsReturned.push(objectArr[i]);
		}
		return objectsReturned;
	};


	//returning all the objects that the passed object could potentially
	//collide with
	this.findObjects = function(objectsReturned, object) {
		if(typeof object === "undefined") {
			console.log("The object is undefined... :(  ");
			return;
		}

		var theIndex = this.getIndex(object);
		//if the index is default, which is -1, (plz note that quads are numbered 0-3
		//and there are items in the nodeArr, cann on the findObjectss function above
		if(theIndex != -1 && this.nodeArr.length) {
			this.nodeArr[theIndex].findObjects(objectsReturned, object);
		}

		//pushing the returned objects into an array
		for(var i = 0, length = objectArr.length; i < length; i++) {
			objectsReturned.push(objectArr[i]);
		}
		return objectsReturned;
	};

	//inserting the objects into the quad tree, if it becomes full,
	//the tree splits and adds all the objects into theircorresponding nodes
	this.insert = function(object) {
		if(typeof object === "undefined") {
			return;
		}
		//conditional testing whether or not the object is an array, meaning
		//there are multiple objects being stored
		if(object instanceof Array) {
			for(var i = 0, length = object.length; i < length; i++) {
				this.insert(object[i]);
				return;
			}
		}
		if(this.nodes.length) {
			var theIndex = this.getIndex(object);
			//only adding to subnode if it fits completely within it
			if (theIndex != -1) {
				this.nodeArr[theIndex].insert(object);
				return;
			}
		}

		objectArr.push(object);

		//prevent the case of infinite splitting when the quad tree gets full
		if(objectArr.length > maxObjectsPerSquare && level < maximumLevels) {
			if(this.nodeArr[0] == null) {
				this.split();
			}
			//using a while loop because I want to insert into the node Array if index is default
			//and add to the counter when object's default index isn't-1
			var x = 0;
			while (x < objectArr.length) {
				var theIndex = this.getIndex(objectArr[x]);
				if(theIndex != -1) {
					this.nodeArr[theIndex].insert((objectArr.splice(i, 1))[0]);
				} else {
						x++;
				}
			}
		}
	};

	//this function sets the location of the object in the quad box for hit detection
	this.getTheIndex = function(object) {
		//this is the default index of an object that has not interacted with the quad tree yet
		//indexes of quadtree are from 0-3
		var theIndex = -1;
		var vertMidpoint = this.bounds.x + this.bounds.width / 2;
		var horiMidpoint = this.bounds.y + this.bounds.height / 2;

		//an object that can fit completely within the top quadrant will satisfy these conditionals
		var topQuad = ((object.y < horiMidpoint) && (object.y + object.height < horiMidpoint));
		//an object that can fit entirely in the bottom quadrant
		var bottomQuad = (object.y > horizontalMidpoint);

		//objects that can fit in the left quadrant
		if((object.x < vertMidpoint) && object.x + object.width < vertMidpoint) {
			if(topQuad) {
				//if the object is in the top quadrant, index is set to 1 (top left)
				theIndex = 1;
			} else if (bottomQuad) {
				theIndex = 2;
			}
		} else if (object.x > vertMidpoint) {
			if(topQuad) {
				theIndex = 0;
			} else if (bottomQuad) {
				theIndex = 3;
			}
		}
		return theIndex;
	};

	//splitting the node into 3 subnodes. They are already stored with their respective
	//indexes, just have to pass each index to the QuadTree Function
	this.split = function() {
		var theSubWidth = (this.bounds.width / 2) | 0;
		var theSubHeight = (this.bounds.height / 2) | 0;
		//splitting top right quadrant 0
		this.nodeArr[0] = new QuadTree({
			x: this.bounds.x + theSubWidth,
			y: this.bounds.y,
			width: theSubWidth,
			height: theSubHeight
		}, level + 1);
		//splitting top left quadrant 1
		this.nodeArr[1] = new QuadTree({
			x: this.bounds.x,
			y: this.bounds.y,
			width: theSubWidth,
			height: theSubHeight
		}, level + 1);
		//splitting the bottom left quadrant numbered 2
		this.nodeArr[2] = new QuadTree({
			x: this.bounds.x,
			y: this.bounds.y + theSubHeight,
			width: theSubWidth,
			height: theSubHeight
		}, level + 1);
		//splitting the final bottom right quad numbered 3
		this.nodeArr[3] = new QuadTree({
			x: this.bounds.x + theSubWidth,
			y: this.bounds.y + theSubHeight,
			width: theSubWidth,
			height: theSubHeight
		}, level + 1)
	};
}


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

	//quick function that takes the pool Array, if alive bool is set to true
	//push the pool indexed item into the declared object
	this.getThePool = function() {
		var object = [];
		for(var i = 0; i < arraySize; i++) {
			if(arrayPool[i].alive) {
				object.push(arrayPool[i]);
			}
		}
		return object;
	}
  //populating the pool with the ulock object
  this.init = function(object) {
    //setting a loop to go through the array of the number of bullets allowed on the canvas
    if(object == "uLock") {
      for(var i = 0; i < arraySize; i++) {
        var uLock = new ULock("uLock");
        uLock.init(0,0, imgDir.uLock.width, imgDir.uLock.height);
				uLock.isCollidableWith = "enemy1";
				uLock.type = "uLock";
        arrayPool[i] = uLock;
      }
    } else if (object == "enemy1") {
      for(var i = 0; i < arraySize; i++) {
				//not adding what the enemy car is collidable with beacuse
				//only the bullets collide with objects, not vice versa
        var enemy1 = new Enemy1();
        enemy1.init(0,0, imgDir.enemy1.width, imgDir.enemy1.height);
        arrayPool[i] = enemy1;
      }
    } else if(object == "enemyAmmo") {
      for(var i = 0; i < arraySize; i++) {
        var enemyAmmo = new ULock("enemyAmmo");
        enemyAmmo.init(0,0, imgDir.enemyAmmo.width, imgDir.enemyAmmo.height);
				enemyAmmo.isCollidableWith = "biker";
				enemyAmmo.type = "enemyAmmo";
        arrayPool[i] = enemyAmmo;
      }
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

  this.getOneULock = function(x, y, speed) {
    if(!arrayPool[arraySize -1].alive) {
			this.get(x, y, speed);
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

  //setting the firing rate and the counter of bullets
  var throwingRate = 15;
  var counter = 0;
	//setting key value pairs for collision detection
	this.isCollidableWith = "enemyAmmo";
	this.type = "biker";

	this.init = function(x, y, width, height) {
		//default vars
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.alive = true;
		this.isCollidingBool = false;
		this.uLockPool.init("uLock");
	}

  //gotta draw the bike on the canvas
  this.draw = function() {
    this.context.drawImage(imgDir.biker, this.x, this.y);
  };
  //calling on the move abstract to actually move when keys are pressed
  //will be (almost like) an event listener, listening for key pressed
  this.move = function() {
    counter ++;

    if (KEY_STATUS.left || KEY_STATUS.right || KEY_STATUS.up || KEY_STATUS.down) {
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
        if(this.y <= this.canvasHeight / 4 * 3) {
          this.y= this.canvasHeight / 4 * 3;
        }
      } else if(KEY_STATUS.down) {
        this.y += this.speed;
        //setting limits on how far down, which isn't really limited except by the
        //dimensions of the canvas
        if(this.y >= this.canvasHeight - this.height) {
          this.y = this.canvasHeight - this.height;
        }
      }
      //finish this be redrawing the biker! after the user input of movement was detected
			//and the conditional passes saying that the player was not hit
			if(this.isCollidingBool) {
					this.draw();
			} else {
				//player was hit by milkshake, game over
				this.alive = false;
				game.gameOver();
			}
    }

    if((KEY_STATUS.space && counter >= throwingRate) && !this.isCollidingBool) {
      this.throw();
      counter = 0;
    }
  };

  this.throw = function() {
    this.uLockPool.getOneULock(this.x + 6, this.y, 3);
		game.chain.get();
  };
}
//gotta set the biker as a new Drawable to inherit the characteristics from that object
Biker.prototype = new Drawable();


//creating an enemy car object
function Enemy1() {
  var percentageOfFire = .01;
  var chance = 0;
  this.alive = false;
	//setting the collision detection key value pairs in the enemy object
	this.isCollidableWith = "uLock";
	this.type = "enemy1";

  //setting the values of the enemies
  this.spawn = function(x, y, theSpeed) {
    this.x = x;
    this.y = y;
    this.speed = theSpeed;
    this.speedX = 0;
    this.speedY = theSpeed;
    this.alive = true;
		//these edges serve as markers on how farthe enemies can go.
		//once they hit one of these values, conditionals activated below will change
		//their direction
    this.leftEdge = this.x - 90;
    this.rightEdge = this.y + 90;
    this.bottomEdge = this.y + 140;
  };

  //moving the drawn enemy
  this.draw = function() {
    this.context.clearRect(this.x -1, this.y, this.width + 1, this.height);
    this.x += this.speedX;
    this.y += this.speedY;
		//if the x coord is less than the left edge limit set above
		//the speed of x equals passed speed
    if (this.x <= this.leftEdge) {
      this.speedX = this.speed;
		//if the x coord is gt or et to its width and the right edge limit
		//reverse direction by making the speed negative
    } else if(this.x >= this.rightEdge + this.width) {
      this.speedX = -this.speed;
		//if the enemy's y coord becomes greater thna or equal to the bottom edge
		//limit set above stop their vertical speed by setting y speed to 0 and
		//move the enemy on screen down 5 pixels
		//and reverse direection again by making x speed negative
    } else if(this.y >= this.bottomEdge) {
      this.speed = 1.5;
      this.speedY = 0;
      this.y -= 5;
      this.speedX = -this.speed;
    }
		//if the enemy isColliding boolean is false, draw the enemy
		if(!this.isCollidingBool) {
			this.context.drawImage(imgDir.enemy1, this.x, this.y);
			//by checking whether or not the collision with enemy is true
			//we can set the enemy have an abililty to shoot each time it moves
			//it's basically a 50/50 chance
			chance = Math.floor(Math.random()*101);
			if(chance / 100 < percentageOfFire) {
				this.throw();
			}
			return false;
		} else {
			//else, if this (enemy object) is colliding, return true add points
			game.bikerScore += 5;
			game.crash.get(); //NEWVAR  .crash .chain .bikerScore
			return true;
		}
  };

  //fire an enemy bullet
  this.throw = function() {
		//throwing the enemyAmmoPool a x, a y, and a speed
    game.enemyAmmoPool.get(this.x + this.width / 2, this.y + this.height, -2.5);
  }

  //resetting the enemy values
  this.clear = function() {
    this.x = 0;
    this.y = 0;
    this.speed = 0;
    this.speedX = 0;
    this.speedY = 0;
    this.alive = false;
		//when clearing have to also set the colliding boolean to false;
		this.isCollidingBool = false;
  }
}
//gotta draw the enemy
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
      //initializing the enemies
      Enemy1.prototype.context = this.mainContext;
      Enemy1.prototype.canvasHeight = this.mainCanvas.height;
      Enemy1.prototype.canvasWidth = this.mainCanvas.width;

      //init on the background object, setting its draw point to cords (0,0)
      //this is basically calling on the init function in drawable object
      this.background = new Background();
      this.background.init(0, 0);  //draw point is at x = 0 and y = 0;
      //need to initialize the Biker Object now
      this.biker = new Biker();
      //setting the biker to start at the bottom middle of the screen
      var bikerStartX = this.bikeCanvas.width / 2 - imgDir.biker.width;
      var bikerStartY = this.bikeCanvas.height / 4 * 4.25 - imgDir.biker.height * 2;
      this.biker.init(bikerStartX, bikerStartY, imgDir.biker.width, imgDir.biker.height);

      //initializing the enemy pool object to hold enemy bullets
      this.enemyPool = new ULockPool(30);
      this.enemyPool.init("enemy1");
      this.enemySpawnWave(); //NEWVAR enemySpawnWave

			this.enemyAmmoPool = new ULockPool(30);
			this.enemyAmmoPool.init("enemyAmmo");

			this.quadTree = new QuadTree({
				x: 0,
				y:0,
				width: this.mainCanvas.width,
				height: this.mainCanvas.height
			});

			//score
			this.playerScore = 0;

			//audio for the game xD
			this.chain = new SoundPoolRef(10);
			this.chain.init("chain");

			this.backgroundMusic = new Audio("sounds/") //NEWSOUND need sound here
			this.backgroundMusic.loop = true;
			this.backgroundMusic.volume = .2;
			this.backgroundMusic.load();

			this.gameOverMusic = new Audio("sounds/") //NEWSOUND need sound
			this.gameOverMusic.loop = true;
			this.gameOverMusic.volume = .2;
			this.gameOverMusic.load();

			this.checkTheAudio = window.setInterval(function() {checkReadyState()}, 1000);
		}
	};
		this.enemySpawnWave = function() {
			var height = imgDir.enemy1.height;
      var width = imgDir.enemy1.width;
      var x = 100;
      var y = -height;
			//space between enemies
      var spacer = y * 1.5;
			for(var i = 0; i <= 18; i++){
				this.enemyPool.get(x, y, 2);
				x += width + 25;
				//if the index item of enemy Array is 6, we want to make a new row
				//only 6 enemies per row
				if( i % 6 == 0) {
					x = 100;
					y += spacer;
				}
			}
		}


  //initializing the animation loop
  this.start = function() {
    //drawing the biker...
    this.biker.draw();
		this.backgroundMusic.play();
    animate();
  };

	this.restart = function() {
		this.gameOverMusic.pause();

		document.getElementById('gameOver').style.display = "none";
		this.backgroundContext.clearRect(0,0, this.backgroundCanvas.width, this.backgroundCanvas.height);
		this.shipContext.clearRect(0,0, this.bikeCanvas.width, this.bikeCanvas.height);
		this.mainContext.clearRect(0,0, this.mainCanvas.width, this.mainCanvas.height);

		this.quadTree.clear();

		this.background.init(0,0);
		this.biker.init(this.bikerStartX, this.bikerStartY, imgDir.biker.width, imgDir.biker.height);

		this.enemyPool.init("enemy1");
		this.enemySpawnWave();
		this.enemyAmmoPool.init("enemyAmmo");

		this.playerScore = 0;

		this.backgroundMusic.currentTime = 0;
		this.backgroundMusic.play();

		this.start();
	};

	this.gameOver = function() {
		this.backgroundMusic.pause();
		this.gameOverMusic.currentTime = 0;
		this.gameOverMusic.play();
		document.getElementById("gameOver").style.display = "block";
	};
}

function checkReadyState() {
	if(game.gameOverMusic.readyState === 4 && (game.backgroundMusic.readyState === 4)) {
		window.clearInterval(game.checkMusic);
		document.getElementById('gameLoading').style.display= "none";
		game.start();
	}
}


function SoundPoolRef(maximumSize) {
	var theMax = maximumSize;
	var poolArr = [];
	this.poolArr = poolArr;
	var currentSound = 0;

	//populating the array with the soundz
	this.init = function(object) {
		if(object == "chain") {
			for(var i = 0; i <theMax; i++) {
				chain = new Audio("sounds/chain.wav")  //NEWSOUND
				chain.volume = .11;
				chain.load();
				poolArr[i] = chain;
			}
		} else if (object == "crash") {
			for (var i = 0; i < size; i++) {
				var chain = new Audio("sounds/crash.wav");  //NEWSOUND
				chain.volume = .1;
				chain.load();
				poolArr[i] = chain;
			}
		}
	};

	//playing a sound
	this.get = function() {
		if(poolArr[currentSound].currentTime == 0 || poolArr[currentSound].ended) {
			poolArr[currentSound].play();
		}
		currentSound = (currentSound + 1) % theMax;
	};
}
//creating the animation loop, calling on the requestAnimationFrame from the API
//by a front end developer named Paul Irish and is what the above this.start calls on
function animate() {
	document.getElementById("score").innerHTML = game.playerScore;
  //have to insert each object into the quad tree
	game.quadTree.clear();
	game.quadTree.insert(game.biker);
	game.quadTree.insert(game.biker.uLockPool.getThePool());
	game.quadTree.insert(game.enemyPool.getThePool());
	game.quadTree.insert(game.enemyAmmoPool.getThePool());

	detectCollision();

	//no more enemies? new level!
	if(game.enemyPool.getThePool().length === 0) {
		game.enemySpawnWave();
	}

	if(game.biker.alive){
		//animating the objects in the game
		requestAnimFrame( animate );
	  game.background.draw();
	  game.biker.move();
	  game.biker.uLockPool.animate();
		game.enemyPool.animate();
		game.enemyAmmoPool.animate();
	}
}

//detection collision algorithmn
function detectCollision() {
	var objectArr = [];
	game.quadTree.getAllObjects(objectArr);

	for(var x = 0, length = objectArr.length; x < length; x++) {
		//for each item in object arr, pass it to findObjectss with blank arr
		game.quadTree.findObjects(objects = [], objectArr[x]);
		//another for loop checking each object against all the other ones
		for(y = 0, length2 = objects.length; y < length2; y++) {
			//the actual detection algorithmn
			//if this indexed object can collide with the other objects set type
			if((objectArr[x].isCollidableWith === objects[y].type) &&
			//if this objects x coord is less than the checked objects x + its width
			(objectArr[x].x < objects[y].x + objects[y].width) &&
			//AND if the first objects X coord + its width is greater than checked obj's x coord
			(objectArr[x].x + objectArr[x].width > objects[y].x) &&
			//checking the y coords of each object like the X ones were checked
			(objectArr[x].y < objects[y].y + objects[y].height) &&
			//checking if collision is within the checked objects location
			(objectArr[x].y + objectArr[x].height > objects[y].y)) {
				//if all of these conditions are satisfied, the bullet, either from
				//the player towards the enemy or vice versa will change the isCollidingBool
				//to true
				objectArr[x].isCollidingBool = true;
				objects[y].isCollidingBool = true;
			}
		}
	}
};


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
