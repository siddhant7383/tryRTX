export default function renderScene(gl) {
  gl.ctx.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.ctx.clearDepth(1.0); // Clear everything
  gl.ctx.clear(gl.ctx.COLOR_BUFFER_BIT | gl.ctx.DEPTH_BUFFER_BIT);
  setVertex(gl);
  setShaderParameters(gl);
  setObjects(gl);
  setTexture(
    gl,
    gl.bcanvas,
    gl.ctx.getUniformLocation(gl.shaderProgram, `previousFrame`),
    0,
    gl.ctx.TEXTURE0
  );
  gl.ctx.drawArrays(gl.ctx.TRIANGLE_STRIP, 0, 4);
}

function setObjects(gl) {
  for (let i = 0; i < gl.objects.length; i++) {
    gl.ctx.uniform1i(
      gl.ctx.getUniformLocation(gl.shaderProgram, `objects[${i}].type`),
      gl.objects[i].type
    );
    gl.ctx.uniform3fv(
      gl.ctx.getUniformLocation(gl.shaderProgram, `objects[${i}].pos`),
      gl.objects[i].position
    );
    gl.ctx.uniform3fv(
      gl.ctx.getUniformLocation(
        gl.shaderProgram,
        `objects[${i}].material.color`
      ),
      gl.objects[i].color
    );
    gl.ctx.uniform3fv(
      gl.ctx.getUniformLocation(
        gl.shaderProgram,
        `objects[${i}].material.emmision`
      ),
      gl.objects[i].emmision
    );
    gl.ctx.uniform1f(
      gl.ctx.getUniformLocation(gl.shaderProgram, `objects[${i}].size`),
      gl.objects[i].size
    );
    gl.ctx.uniform1f(
      gl.ctx.getUniformLocation(
        gl.shaderProgram,
        `objects[${i}].material.roughness`
      ),
      gl.objects[i].roughness
    );
  }
}

function setShaderParameters(gl) {
  gl.ctx.uniform1i(
    gl.ctx.getUniformLocation(gl.shaderProgram, `world.objectCount`),
    gl.objects.length
  );
  gl.ctx.uniform1f(
    gl.ctx.getUniformLocation(gl.shaderProgram, `world.height`),
    gl.height
  );
  gl.ctx.uniform1f(
    gl.ctx.getUniformLocation(gl.shaderProgram, `world.width`),
    gl.width
  );
  gl.ctx.uniform1f(
    gl.ctx.getUniformLocation(gl.shaderProgram, `camera.focalLength`),
    gl.camera.focalLength
  );
  gl.ctx.uniform3fv(
    gl.ctx.getUniformLocation(gl.shaderProgram, `camera.pos`),
    gl.camera.pos
  );
  gl.ctx.uniform3fv(
    gl.ctx.getUniformLocation(gl.shaderProgram, `camera.rotation`),
    gl.camera.rotation
  );
  gl.ctx.uniform4fv(
    gl.ctx.getUniformLocation(gl.shaderProgram, `externalSeed`),
    [Math.random(), Math.random(), Math.random(), Math.random()]
  );
  gl.ctx.uniform1f(
    gl.ctx.getUniformLocation(gl.shaderProgram, `world.samples`),
    gl.samples
  );
}

function setVertex(gl) {
  gl.ctx.bindBuffer(gl.ctx.ARRAY_BUFFER, gl.positionBuffer);
  gl.ctx.vertexAttribPointer(
    gl.ctx.getAttribLocation(gl.shaderProgram, "aVertexPosition"),
    2,
    gl.ctx.FLOAT,
    false,
    0,
    0
  );
  gl.ctx.enableVertexAttribArray(
    gl.ctx.getAttribLocation(gl.shaderProgram, "aVertexPosition")
  );
}

function setTexture(gl, image, location, index, param) {
  const texture = gl.ctx.createTexture();
  gl.ctx.activeTexture(param);
  gl.ctx.bindTexture(gl.ctx.TEXTURE_2D, texture);
  gl.ctx.texImage2D(
    gl.ctx.TEXTURE_2D,
    0,
    gl.ctx.RGBA,
    gl.width,
    gl.height,
    0,
    gl.ctx.RGBA,
    gl.ctx.UNSIGNED_BYTE,
    image
  );

  // gl.ctx.generateMipmap(gl.ctx.TEXTURE_2D);
  gl.ctx.texParameteri(
    gl.ctx.TEXTURE_2D,
    gl.ctx.TEXTURE_WRAP_S,
    gl.ctx.CLAMP_TO_EDGE
  );
  gl.ctx.texParameteri(
    gl.ctx.TEXTURE_2D,
    gl.ctx.TEXTURE_WRAP_T,
    gl.ctx.CLAMP_TO_EDGE
  );
  gl.ctx.texParameteri(
    gl.ctx.TEXTURE_2D,
    gl.ctx.TEXTURE_MIN_FILTER,
    gl.ctx.LINEAR
  );
  gl.ctx.uniform1i(location, index);
}
