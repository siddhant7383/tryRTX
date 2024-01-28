export default function initShaders(gl, vsSource, fsSource) {
  const vertexShader = loadShader(gl.ctx, gl.ctx.VERTEX_SHADER, vsSource);
  const fregmentShader = loadShader(gl.ctx, gl.ctx.FRAGMENT_SHADER, fsSource);

  gl.shaderProgram = gl.ctx.createProgram();
  gl.ctx.attachShader(gl.shaderProgram, vertexShader);
  gl.ctx.attachShader(gl.shaderProgram, fregmentShader);
  gl.ctx.linkProgram(gl.shaderProgram);
}

function loadShader(ctx, type, source) {
  const shader = ctx.createShader(type);
  ctx.shaderSource(shader, source);
  ctx.compileShader(shader);

  if (!ctx.getShaderParameter(shader, ctx.COMPILE_STATUS)) {
    console.warn(
      `An error occurred compiling the shaders: ${ctx.getShaderInfoLog(shader)}`
    );
    ctx.deleteShader(shader);
    return null;
  }

  return shader;
}
