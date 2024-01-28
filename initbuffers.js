export default function initBuffers(gl) {
  gl.positionBuffer = gl.ctx.createBuffer();
  gl.ctx.bindBuffer(gl.ctx.ARRAY_BUFFER, gl.positionBuffer);
  const positions = [1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, -1.0];
  gl.ctx.bufferData(
    gl.ctx.ARRAY_BUFFER,
    new Float32Array(positions),
    gl.ctx.STATIC_DRAW
  );
}
