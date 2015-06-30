var game = new Game();

function init() {
  if(game.init()) {
    game.start();
  }
}

var imgDir = new function() {
  this.empty = null;

  this.background = new Image();

  this.background.src = "img/road.png";
};
