let canvas;
let world;
let keyboard = new Keyboard();

function init() {
canvas = document.getElementById('canvas');
world = new World(canvas, keyboard);

console.log("My Character is", world.character);
console.log("Enemies are", world.enemies);


}

window.addEventListener('keydown', (event) => {
   if(event.keyCode==39 || event.key === 'd')
       keyboard.right=true;
   if(event.keyCode==37 || event.key === 'a')
       keyboard.left=true;
   if(event.keyCode==38 || event.key === 'w')
       keyboard.up=true;
   if(event.keyCode==40 || event.key === 's')
       keyboard.down=true;
   if(event.keyCode==32 || event.key === ' ')
       keyboard.space=true;

   console.log(keyboard);
});
window.addEventListener('keyup', (event) => {
   if(event.keyCode==39 || event.key === 'd')
       keyboard.right=false;
   if(event.keyCode==37 || event.key === 'a')
       keyboard.left=false;
   if(event.keyCode==38 || event.key === 'w')
       keyboard.up=false;
   if(event.keyCode==40 || event.key === 's')
       keyboard.down=false;
   if(event.keyCode==32 || event.key === ' ')
       keyboard.space=false;

   console.log(keyboard);
});
