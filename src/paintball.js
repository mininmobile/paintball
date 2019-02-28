let canvas = document.createElement("canvas");
canvas.width = document.children[0].scrollWidth;
canvas.height = document.children[0].scrollHeight;
document.body.appendChild(canvas);

// rendering
let ctx = canvas.getContext("2d");

ctx.fillStyle = "#161621";
ctx.fillRect(0, 0, canvas.width, canvas.height);
