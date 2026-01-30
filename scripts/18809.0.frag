// Gamma correction by Omar El Sayyed.
//
// Note: gamma correction is the last line only :D
// For more information about Gamma correction, http://en.wikipedia.org/wiki/Gamma_correction
// For more information about why we need it in 3D graphics, http://http.developer.nvidia.com/GPUGems3/gpugems3_ch24.html
//
// Join us on our quest for learning shaders: https://www.facebook.com/groups/748114015233903/
// And please like our page :P
// https://www.facebook.com/nomonesoftware

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const vec3 eyePosition = vec3(0.0, 0.0, -2.0);

const float sphereRadius = 0.25;

float intersectSphere(vec3 rayVector, vec3 pointOnRay, vec3 sphereCenter, float sphereRadius) {
  
  vec3 sphereCenterToRayPoint = pointOnRay - sphereCenter;
  
  float a = dot(rayVector, rayVector);
  float b = 2.0*dot(rayVector, sphereCenterToRayPoint);
  float c = dot(sphereCenterToRayPoint, sphereCenterToRayPoint) - sphereRadius*sphereRadius;
  
  float descriminant = b*b - 4.0*a*c;
  if (descriminant < 0.0) return -1.0;  
  
  float t = (-b - sqrt(descriminant)) / (2.0*a);
  
  return t;
}

vec4 light(vec3 pointPosition, vec3 pointNormal, vec3 lightPostiion, vec4 ambientColor, vec4 diffuseColor, vec4 specularColor, float shininess) {  
  
  vec3 L = normalize(lightPostiion - pointPosition);   
  vec3 E = normalize(eyePosition - pointPosition); 
  vec3 R = normalize(-reflect(L, pointNormal));  
 
  // Calculate ambient term,
  vec4 ambient = ambientColor;

  // Calculate diffuse term,
  vec4 diffuse = diffuseColor * max(dot(pointNormal,L), 0.0);
  diffuse = clamp(diffuse, 0.0, 1.0);     

  // Calculate specular term,
  vec4 specular = specularColor * pow(max(dot(R,E),0.0),0.3*shininess);
  specular = clamp(specular, 0.0, 1.0); 

  return ambient + diffuse + specular;
}

void main() {
  
  // Normalize coordinates,
  vec3 pointPosition = vec3((gl_FragCoord.xy / resolution)*2.0 - 1.0, 0.0);
  pointPosition.y *= resolution.y / resolution.x;

  bool right = false;
  if (pointPosition.x > 0.0) {
    right = true;
    pointPosition.x = - pointPosition.x;
  }
	
  vec3 sphereCenter = vec3(-0.5, 0.0, 0.0);
  
  // Ray cast,
  vec3 rayVector = pointPosition - eyePosition;
  float t = intersectSphere(rayVector, eyePosition, sphereCenter, sphereRadius);
  
  if (t == -1.0) {
    gl_FragColor = vec4(0.0);
    return ;
  }
  
  vec3 intersectionPoint = eyePosition + (t * rayVector);
  vec3 normal = normalize(intersectionPoint - sphereCenter);
  
  // Light,
  vec3 lightPosition = vec3(2.0, 0.0, 0.0);

  gl_FragColor = light(
    intersectionPoint, normal, 
    lightPosition, 
    vec4(0.15, 0.0, 0.0, 1.0), 
    vec4(1.0, 0.2, 0.2, 1.0), 
    vec4(0.0, 0.0, 0.0, 1.0),
    40.0);

  if (right) {
    // Gamma correction,
    gl_FragColor = pow(gl_FragColor, vec4(1.0/2.2));
  }
}