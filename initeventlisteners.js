export default function initEventListeners(ui, gl) {
  window.onresize = () => {
    ui.updateViewportSize();
  };
  var shouldDrag = false;
  document.documentElement.addEventListener("webkitfullscreenchange", () => {
    if (!document.fullscreenElement) {
      gl.vp.pointerLockElement = null;
      shouldDrag = false;
    }
  });
  window.onmousedown = (event) => {
    shouldDrag = true;
    if (document.documentElement.webkitRequestFullScreen) {
      document.documentElement.webkitRequestFullScreen();
    }
    gl.vp.requestPointerLock();
  };
  var touchStart = [0, 0];
  window.ontouchstart = (event) => {
    touchStart[0] = event.touches[0].clientX;
    touchStart[1] = event.touches[0].clientY;
  };
  window.ontouchmove = (event) => {
    var deltaX = touchStart[0] - event.touches[0].clientX;
    var deltaY = touchStart[1] - event.touches[0].clientY;
    gl.camera.rotation[1] -= deltaX / 200;
    gl.camera.rotation[0] -= deltaY / 200;
    touchStart[0] = event.touches[0].clientX;
    touchStart[1] = event.touches[0].clientY;
    gl.samples = 1;
    gl.shouldResetSamples = true;
  };
  window.onmousemove = (event) => {
    if (shouldDrag) {
      gl.camera.rotation[1] -= event.movementX / 200;
      gl.camera.rotation[0] -= event.movementY / 200;
      gl.samples = 1;
      gl.shouldResetSamples = true;
    }
  };
  window.onkeydown = (event) => {
    console.log(event.key);
    const step = 10;
    const rstep = 0.1;
    gl.samples = 1;
    gl.shouldResetSamples = true;
    switch (event.key) {
      case "w": {
        gl.camera.moveForward = 1;
        break;
      }
      case "s": {
        gl.camera.moveForward = -1;
        break;
      }
      case "a": {
        gl.camera.moveSide = -1;
        break;
      }
      case "d": {
        gl.camera.moveSide = 1;
        break;
      }
      case "Control": {
        gl.camera.pos[1] -= step;
        break;
      }
      case " ": {
        gl.camera.pos[1] += step;
        break;
      }
      case "ArrowUp": {
        gl.camera.rotation[0] += rstep;
        break;
      }
      case "ArrowDown": {
        gl.camera.rotation[0] -= rstep;
        break;
      }
      case "ArrowLeft": {
        gl.camera.rotation[1] += rstep;
        break;
      }
      case "ArrowRight": {
        gl.camera.rotation[1] -= rstep;
        break;
      }
      case "j": {
        gl.camera.rotation = [0, 1, 0];
        break;
      }
      default: {
        document.fullscreenElement;
      }
    }
  };
  window.onkeyup = (event) => {
    console.log(event.key);
    gl.samples = 1;
    const step = 10;
    const rstep = 0.1;
    switch (event.key) {
      case "w": {
        gl.camera.moveForward = 0;
        break;
      }
      case "s": {
        gl.camera.moveForward = 0;
        break;
      }
      case "a": {
        gl.camera.moveSide = 0;
        break;
      }
      case "d": {
        gl.camera.moveSide = 0;
        break;
      }
      case "Control": {
        gl.camera.pos[1] -= step;
        break;
      }
      case " ": {
        gl.camera.pos[1] += step;
        break;
      }
      case "ArrowUp": {
        gl.camera.rotation[0] += rstep;
        break;
      }
      case "ArrowDown": {
        gl.camera.rotation[0] -= rstep;
        break;
      }
      case "ArrowLeft": {
        gl.camera.rotation[1] += rstep;
        break;
      }
      case "ArrowRight": {
        gl.camera.rotation[1] -= rstep;
        break;
      }
      case "j": {
        gl.camera.rotation = [0, 1, 0];
        break;
      }
    }
  };
}
