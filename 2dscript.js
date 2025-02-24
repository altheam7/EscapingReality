
// Declare resources
let resources = {
	images: [
    {id: "bk", src: "introImages/introImg.jpg" },
    {id: "logo", src: "introImages/logoTitle.png" },
    {id: "intro", src: "introImages/text.png" }
	],       
	audios:[ 
	{id:"mainTheme", src:"audios/Fire Emblem (Main Theme).wav"}
	]
};

// Load resources and start game loop
function preload() {
  game = new Game("game"); // game object (uses canvas id)
  game.preload(resources); // preloads "resources"

  game.state = init; //sets state of game to execute init() function
  gameloop(); //first call to gameloop() function
}
document.onload = preload(); //when page loads, call preload() function


// Control the state of the game
function gameloop() {
  game.processInput(); // handle mouse & key actions (input)

  if (game.ready) { // game.ready becomes true when resources have loaded
    game.state(); // determine function to execute based on current state of game
  }

  game.update(); // refresh canvas
  setTimeout(gameloop, 10); //call up gameloop every 10ms
}

// Initialize Game settings and create game objects
function init() {
  bk = new Sprite(game.images.bk, game);//creates an image object 
  bk.scale = 0.5; //scale the image down to 50% of original size

  logo = new Sprite(game.images.logo, game);
  intro = new Sprite(game.images.intro, game);


  //create a font object
  f = new Font("30pt", "Arial", "white", "black"); //size,family,text,shadow
  f2 = new Font("30pt", "Arial", "blue", "yellow");

  mainTheme = new Sound(game.audios.mainTheme);
  game.state = startScreen; //replace game state from 'main' to 'startScreen'
}

//Define startScreen function
function startScreen() {
  bk.draw();
  logo.draw();
  intro.draw(game.width / 2 - 0, game.height - 150, f);
  mainTheme.play();
  if (mouse.leftClick) {
    game.state = main; //sets state of game to execute main() function
  }
}

// Main program (Game logic)
function main() {
   if (mouse.leftClick) {
    // Redirect to the 3D game (index.html)
    window.location.href = "index1.html";
  }
}// end of main function
