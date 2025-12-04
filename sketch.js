let glasses = [];
let selected = null;
let cameraX = 0.5;
let cameraY = 0;
let startX = 0;
let startY = 0;
let dragging = false;

let uiFont;

function preload() {
  uiFont = loadFont("https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.9.0/assets/Roboto-Regular.ttf");
}

function setup() {
  createCanvas(800, 600, WEBGL);
  
  if (uiFont) {
    textFont(uiFont);
  }

  glasses.push({ x: 0, y: 0, z: 0, size: 200 });
  glasses.push({ x: 50, y: -30, z: 50, size: 180 });
  glasses.push({ x: -50, y: -60, z: -50, size: 220 });
}

function draw() {
  background(255);
  ambientLight(100);
  directionalLight(255, 255, 255, 0.5, 0.5, -1);

  // Camera rotation
  rotateX(cameraX);
  rotateY(cameraY);

  // Depth sorting
  glasses.sort((a, b) => {
    let depthA = a.z * cos(cameraY) - a.x * sin(cameraY);
    let depthB = b.z * cos(cameraY) - b.x * sin(cameraY);
    return depthA - depthB;
  });

  // Draw glasses
  for (let i = 0; i < glasses.length; i++) {
    let g = glasses[i];
    push();
@@ -53,50 +57,53 @@ function draw() {
    fill(64, 224, 208, 60);
    box(g.size, 10, g.size);
    pop();
  }

  // Draw static UI panel last
  drawControls();
}

function drawControls() {
  push();

  // Reset transforms so 2D UI is unaffected by camera rotation
  resetMatrix();

  // Move origin to top-left corner
  translate(-width / 2, -height / 2);

  // UI panel background
  fill(255);
  stroke(0);
  strokeWeight(1);
  rect(10, 10, 220, 130);

  // Text
  if (uiFont) {
    textFont(uiFont);
  }
  fill(0);
  noStroke();
  textSize(16);
  textAlign(LEFT, TOP);
  text("Controls", 20, 20);

  textSize(12);
  text("A - Add new glass piece", 20, 45);
  text("R - Remove last piece", 20, 60);
  text("Click - Select glass piece", 20, 75);
  text("Arrow Keys - Move selected", 20, 90);
  text("Drag - Rotate camera view", 20, 105);

  pop();
}

function mousePressed() {
  let found = false;

  for (let i = glasses.length - 1; i >= 0; i--) {
    let g = glasses[i];

    let mx = mouseX - width / 2;
    let my = mouseY - height / 2;
    let distance = dist(mx, my, g.x, g.y);
