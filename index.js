import initShaders from "./initshaders.js";
import initBuffers from "./initbuffers.js";
import renderScene from "./render.js";
import initEventListeners from "./initeventlisteners.js";

//=====================
//DOM ELEMENTS
//=====================
const viewport = document.getElementById("viewport");
const buffer = document.getElementById("buffer");
buffer.style.display = "none";

//=====================
//Parameters
//=====================
const gl = {
  vp: viewport,
  bcanvas: buffer,
  camera: {
    pos: [0, 0, -100],
    rotation: [0, 0, 0],
    focalLength: 500,
    moveForward: 0,
    moveSide: 0,
  },
  samples: 1,
  bctx: null,
  ctx: null,
  objects: null,
  shaderProgram: null,
  positionBuffer: null,
  height: null,
  width: null,
  vertexSource: null,
  fragmentSource: null,
  shouldResetSamples: true,
};
const ui = {
  updateViewportSize: null,
};
fetchShader();

//=====================
//Functions
//=====================

ui.updateViewportSize = () => {
  gl.height = window.innerHeight;
  gl.width = window.innerWidth;
  viewport.width = gl.width;
  viewport.height = gl.height;
  buffer.width = gl.width;
  buffer.height = gl.height;
  gl.samples = 1;
  if (gl.ctx) {
    gl.ctx.viewport(0, 0, gl.width, gl.height);
  }
};

async function fetchShader() {
  await fetch("./shader/vertex.glsl").then((response) =>
    response.text().then((shaderCode) => {
      gl.vertexSource = shaderCode;
    })
  );
  await fetch("./shader/fragment.glsl").then((response) =>
    response.text().then((shaderCode) => {
      gl.fragmentSource = shaderCode;
    })
  );
  await fetch("./objects.json").then((response) =>
    response.text().then((objects) => {
      gl.objects = JSON.parse(objects);
    })
  );
  ui.updateViewportSize();
  run();
}

function run() {
  initEventListeners(ui, gl);
  initWebgl();
  initShaders(gl, gl.vertexSource, gl.fragmentSource);
  initBuffers(gl);
  console.log(gl.objects);
  gl.ctx.useProgram(gl.shaderProgram);
  mainLoop();
}

function mainLoop() {
  updateCamera();
  if (gl.shouldResetSamples) {
    gl.bctx.clearRect(0, 0, gl.width, gl.height);
    gl.shouldResetSamples = false;
  }
  if (gl.camera.moveForward != 0) {
    moveForward(gl, 5, gl.camera.moveForward);
  }
  if (gl.camera.moveSide != 0) {
    moveSide(gl, 5, gl.camera.moveSide);
  }
  gl.samples++;
  renderScene(gl);
  gl.bctx.drawImage(viewport, 0, 0);
  requestAnimationFrame(mainLoop);
}

function updateCamera() {
  gl.camera.focalLength = 500;
}

function initWebgl() {
  gl.ctx = viewport.getContext("webgl2");
  if (gl.ctx === null) {
    alert("GL NOT PRESENT");
    return;
  }
  gl.bctx = buffer.getContext("2d");
}

function moveForward(gl, step, dir) {
  gl.samples = 1;
  const forwardVector = getForwardVector(gl, gl.camera.rotation);

  gl.camera.pos[0] += dir * (step * forwardVector[0]);
  gl.camera.pos[1] += dir * (step * forwardVector[1]);
  gl.camera.pos[2] += dir * (step * forwardVector[2]);
}

function moveSide(gl, step, dir) {
  gl.samples = 1;
  const temp = [
    0,
    gl.camera.rotation[1] - (90 * 3.14) / 180,
    gl.camera.rotation[2],
  ];
  const forwardVector = getForwardVector(gl, temp);
  gl.camera.pos[0] += dir * (step * forwardVector[0]);
  gl.camera.pos[1] += dir * (step * forwardVector[1]);
  gl.camera.pos[2] += dir * (step * forwardVector[2]);
}

function getForwardVector(gl, dir) {
  const dx = -Math.sin(dir[1]);
  const dy = Math.sin(dir[0]);
  const dz = Math.cos(dir[1]);
  return [dx, dy, dz];
}
