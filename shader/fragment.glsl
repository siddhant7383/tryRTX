#version 300 es
precision highp float;
in vec2 v_texCoord;
out vec4 fragColor;

uniform float check;

struct Ray{
  vec3 origin;
  vec3 dir;
};

struct Material{
  vec3 color;
  vec3 emmision;
  float roughness;
};

struct Object{
  vec3 pos;
  float size;
  int type;
  Material material;
};

struct World{
  int objectCount;
  float height;
  float width;
  float samples;
};

struct Camera{
  float focalLength;
  vec3 pos;
  vec3 rotation;
};

struct HitInfo{
  vec3 point;
  vec3 normal;
  float dist;
  Material material;
};

#define MAXOBJECTS 10
uniform Object objects[MAXOBJECTS];
uniform World world;
uniform Camera camera;
uniform vec4 externalSeed;
uniform sampler2D uPreviousFrame;

bool checkSphereCollision(inout HitInfo hitInfo, Ray ray, Object object){
  vec3 sphereRay = object.pos - ray.origin;
  float distSphereRay = length(sphereRay);

  float distToClosestPointOnRay = dot(sphereRay, ray.dir);
  
  float distFromClosestPointToSphere = sqrt(
    distSphereRay * distSphereRay - distToClosestPointOnRay * distToClosestPointOnRay
  );
  if(distToClosestPointOnRay > 0.0 && distFromClosestPointToSphere < object.size){
    hitInfo.dist = distToClosestPointOnRay - sqrt(abs(object.size*object.size - distFromClosestPointToSphere *distFromClosestPointToSphere));
    hitInfo.point = ray.origin + ray.dir * hitInfo.dist;
    hitInfo.normal = normalize(hitInfo.point - object.pos);
    return true;
  }
  return false;
}

bool trace(Ray ray,inout HitInfo resultHitInfo){
  float minDist = 1000000000.0;
  resultHitInfo.normal = ray.dir;
  bool collided = false;
  for(int i=0; i<world.objectCount; i++){
    HitInfo hitInfo;
    if(checkSphereCollision(hitInfo, ray, objects[i]) && hitInfo.dist < minDist){
      collided = true;
      resultHitInfo = hitInfo;
      resultHitInfo.material = objects[i].material;
      minDist = hitInfo.dist;
    }
  }
  return collided;
}

float random(int state){
  state = state * 747796405 + 2891336453;
  int result = ((state>>((state >> 28)+4))^state)+277803737;
  result = (result>>22)^result;
  return float(result)/4294967295.0;
}

vec3 checkCollision(Ray ray, vec3 randomDir){
  vec3 color = vec3(0.0, 0.0, 0.0);
  vec3 rayColor = vec3(1.0, 1.0, 1.0);
  vec3 diffuse, specular;
  vec3 temp = ray.dir;
  for(int i=0; i<4; i++){
    HitInfo hitInfo;
    if(trace(ray, hitInfo)){
      temp = hitInfo.normal;
      color += rayColor * hitInfo.material.emmision;
      rayColor *= hitInfo.material.color;
      diffuse = normalize(hitInfo.normal+randomDir);
      specular = reflect(ray.dir, hitInfo.normal);
      ray.dir = mix(diffuse, specular, hitInfo.material.roughness);
      ray.origin = hitInfo.point;
    } else {
      vec3 c = ray.dir;
      float a = 1.0*(1.0-c.y);
      //color += ((0.8-a)*vec3(0.5, 0.5, 0.5) + a*vec3(0.5, 0.7, 1.0))*rayColor;
      break;
    }
  }
  return color;
}

void denoise(inout vec4 prevColor){
  for(int i=-1; i<=1; i++){
    for(int j=-1; j<=1; j++){
        vec2 v_texCoordLeft = v_texCoord*2.0-1.0 + (vec2(float(i)/world.width, float(j)/world.height));
        prevColor += texture(uPreviousFrame, (v_texCoordLeft+1.0)/2.0);
    }
  }
  prevColor /= 9.0;
}

void main() {

  vec3 point;
  point.x = gl_FragCoord.x-world.width/2.0 + externalSeed.x;
  point.y = gl_FragCoord.y-world.height/2.0 + externalSeed.y;
  point.z = camera.focalLength;
  
  mat3x3 rotationMatrixX = mat3x3(
    vec3(1.0, 0.0, 0.0),
    vec3(0.0, cos(camera.rotation.x), -sin(camera.rotation.x)),
    vec3(0.0, sin(camera.rotation.x), cos(camera.rotation.x))
  );

  mat3x3 rotationMatrixY = mat3x3(
    vec3(cos(camera.rotation.y), 0.0, sin(camera.rotation.y)),
    vec3(0.0, 1.0, 0.0),
    vec3(-sin(camera.rotation.y), 0.0, cos(camera.rotation.y))
  );
  
  mat3x3 rotationMatrixZ = mat3x3(
    vec3(cos(camera.rotation.z), -sin(camera.rotation.z), 0.0),
    vec3(sin(camera.rotation.z), cos(camera.rotation.z), 0.0),
    vec3(0.0, 0.0, 1.0)
  );

  point = rotationMatrixZ * rotationMatrixY * rotationMatrixX * point;
  Ray ray;
  ray.origin = camera.pos;
  ray.dir = normalize(point);
  vec3 randomValue;
  vec3 color;
  int samples = 1;
  vec4 prevColor;
  if(world.samples<50.0){
    denoise(prevColor);
  } else {
    prevColor = texture(uPreviousFrame, v_texCoord);
  }
  for(int i=0; i<samples; i++){
    randomValue.x = fract(sin(dot(gl_FragCoord.xyz, vec3(12.9898, 78.233, 45.5432)+externalSeed.x))*(43758.5453+float(i)));
    randomValue.y = fract(sin(dot(gl_FragCoord.xyz, vec3(12.9898, 78.233, 45.5432)+externalSeed.y))*(43758.5453+float(i+1)));
    randomValue.z = fract(sin(dot(gl_FragCoord.xyz, vec3(12.9898, 78.233, 45.5432)+externalSeed.z))*(43758.5453+float(i+2)));
    color += checkCollision(ray, (randomValue)*2.0-1.0);
  }
  color /= float(samples);
  float weight = 1.0 / (world.samples + 1.0);
  color = color*weight + prevColor.xyz * (1.0 - weight);
  fragColor = vec4(color, 1.0);
}