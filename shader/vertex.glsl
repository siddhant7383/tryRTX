#version 300 es
in vec2 aVertexPosition;
out vec2 v_texCoord;
void main() {
  v_texCoord = vec2((aVertexPosition.x+1.0)/2.0,1.0-(aVertexPosition.y+1.0)/2.0);
  gl_Position = vec4(aVertexPosition, 0.0, 1.0);
}