// BREXIT

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
#define PI 3.14159265

vec3 eyePosition = vec3(0.0, 0.0, -2.5);
vec3 lightPosition = vec3(0.0, 0.0, -1.0);

#define CHS 0.18
float sdBox2(in vec2 p,in vec2 b) {vec2 d=abs(p)-b;return length(max(d,vec2(0))) + min(max(d.x,d.y),0.0);}
float line2(float d,vec2 p,vec4 l){vec2 pa=p-l.xy;vec2 ba=l.zw-l.xy;float h=clamp(dot(pa,ba)/dot(ba,ba),0.0,1.0);return min(d,length(pa-ba*h));}
float TB(vec2 p, float d){p.y=abs(p.y);return line2(d,p,vec4(2,3.25,-2,3.25)*CHS);}
float B(vec2 p,float d){p.y+=1.75*CHS;d=min(d,abs(sdBox2(p,vec2(2.0,1.5)*CHS)));p+=vec2(0.5,-3.25)*CHS;return min(d,abs(sdBox2(p,vec2(1.5,1.75)*CHS)));} float E(vec2 p,float d){d=TB(p,d);d=line2(d,p,vec4(-2,3.25,-2,-3.25)*CHS);return line2(d,p,vec4(0,-0.25,-2,-0.25)*CHS);} float I(vec2 p,float d){d=line2(d,p,vec4(0,-3.25,0,3.25)*CHS);p.y=abs(p.y);return line2(d,p,vec4(1.5,3.25,-1.5,3.25)*CHS);} float R(vec2 p,float d){d=line2(d,p,vec4(0.5,-0.25,2,-3.25)*CHS);d=line2(d,p,vec4(-2,-3.25,-2,0.0)*CHS);p.y-=1.5*CHS;return min(d, abs(sdBox2(p,vec2(2.0,1.75)*CHS)));} float T(vec2 p,float d){d=line2(d,p,vec4(0,-3.25,0,3.25)*CHS);return line2(d,p,vec4(2,3.25,-2,3.25)*CHS);} float X(vec2 p,float d){d = line2(d,p,vec4(-2,3.25,2,-3.25)*CHS);return line2(d,p,vec4(-2,-3.25,2,3.25)*CHS);} // DOGSHIT

float GetText(vec2 uv)
{
	uv.y += sin(time*4.0+uv.x)*0.3;
	uv.y += time*4.0;
	uv.y = mod(uv.y,2.0)-1.0;
	uv.y -= 0.1;
	uv.x += 2.75;
	float d = B(uv,1.0);uv.x -= 1.1;
	d = R(uv,d);uv.x -= 1.1;
	d = E(uv,d);uv.x -= 1.1;
	d = X(uv,d);uv.x -= 1.1;
	d = I(uv,d);uv.x -= 1.1;
	d = T(uv,d);
	return smoothstep(0.0,0.05,d-0.55*CHS);
}

vec3 daTexture(vec2 position) {

  vec3 color = vec3(0.3, 0.3, 0.5);
	position-=0.5;
	position.x = -position.x;
	float dd = GetText(position*7.0);
	
	color = mix(color+vec3(0.6,0.6,0.4),color,dd);


  return color;
}

float intersectCube(vec3 rayVector, vec3 pointOnRay, vec3 cubeMin, vec3 cubeMax) {
  
  vec3 tMin = (cubeMin - pointOnRay) / rayVector;
  vec3 tMax = (cubeMax - pointOnRay) / rayVector;
  
  vec3 tNear = min(tMin, tMax);
  vec3 tFar  = max(tMin, tMax);
  
  float tNearMax = max(max(tNear.x, tNear.y), tNear.z);
  float tFarMin  = min(min(tFar .x, tFar .y), tFar .z);
  
  if (tNearMax > tFarMin) return 1000.0;
  
  return max(max(tNear.x, tNear.y), tNear.z);  
}

vec3 getPointOnCubeNormal(vec3 point, vec3 cubeMin, vec3 cubeMax) {
  if (abs(point.x-cubeMin.x) < 0.001) return vec3(-1.0,  0.0,  0.0);
  else if (abs(point.x-cubeMax.x) < 0.001) return vec3( 1.0,  0.0,  0.0);
  else if (abs(point.y-cubeMin.y) < 0.001) return vec3( 0.0, -1.0,  0.0);
  else if (abs(point.y-cubeMax.y) < 0.001) return vec3( 0.0,  1.0,  0.0);
  else if (abs(point.z-cubeMin.z) < 0.001) return vec3( 0.0,  0.0, -1.0);
  else if (abs(point.z-cubeMax.z) < 0.001) return vec3( 0.0,  0.0,  1.0);
  else return vec3(0.0);
}

vec3 getPointOnCubeTextureColor(vec3 point, vec3 cubeMin, vec3 cubeMax) {
  if (abs(point.x-cubeMin.x) < 0.001) {
    return daTexture(vec2(
        (cubeMax.z - point.z) / (cubeMax.z - cubeMin.z),
        (cubeMax.y - point.y) / (cubeMax.y - cubeMin.y)));
  } else if (abs(point.x-cubeMax.x) < 0.001) {
    return daTexture(vec2(
        (point.z - cubeMin.z) / (cubeMax.z - cubeMin.z),
        (cubeMax.y - point.y) / (cubeMax.y - cubeMin.y)));
  } else if (abs(point.y-cubeMin.y) < 0.001) {
    return daTexture(vec2(
        (point.x - cubeMin.x) / (cubeMax.x - cubeMin.x),
        (point.z - cubeMin.z) / (cubeMax.z - cubeMin.z)));
  } else if (abs(point.y-cubeMax.y) < 0.001) {
    return daTexture(vec2(
        (point.x - cubeMin.x) / (cubeMax.x - cubeMin.x),
        (cubeMax.z - point.z) / (cubeMax.z - cubeMin.z)));
  } else if (abs(point.z-cubeMin.z) < 0.001) {
    return daTexture(vec2(
        (point.x - cubeMin.x) / (cubeMax.x - cubeMin.x),
        (cubeMax.y - point.y) / (cubeMax.y - cubeMin.y)));
  } else if (abs(point.z-cubeMax.z) < 0.001) {
      return daTexture(vec2(
        (cubeMax.x - point.x) / (cubeMax.x - cubeMin.x),
        (cubeMax.y - point.y) / (cubeMax.y - cubeMin.y)));
  } else return vec3(0.0);
}

vec4 light(vec3 pointPosition, vec3 pointNormal, vec3 lightPostiion, vec4 ambientColor, vec4 diffuseColor, vec4 specularColor, float shininess) {  
  
  vec3 L = normalize(lightPostiion - pointPosition);   
  vec3 E = normalize(eyePosition - pointPosition); 
  vec3 R = normalize(-reflect(L, pointNormal));  
  vec4 ambient = ambientColor;
  vec4 diffuse = diffuseColor * max(dot(pointNormal,L), 0.0);
  diffuse = clamp(diffuse, 0.0, 1.0);     
  vec4 specular = specularColor * pow(max(dot(R,E),0.0),0.3*shininess);
  specular = clamp(specular, 0.0, 1.0); 
  return ambient + diffuse + specular;
}

void main() {
  
  // Normalize coordinates,
  vec3 pointPosition = vec3((gl_FragCoord.xy / resolution) * 2.0 - 1.0, -0.5+sin(time*2.1));
	vec2 uv = pointPosition.xy;
  pointPosition.x *= resolution.x / resolution.y;
  
  vec3 cubeMin = vec3(-0.5, -0.5, -0.5);
  vec3 cubeMax = vec3( 0.5,  0.5,  0.5);

  // Transform point, eye and light positions to rotate the cube,
  vec3 cubeCenter = (cubeMin + cubeMax) * 0.5;

  // Rotate around x-axis,
  vec3 tempPoint = pointPosition - cubeCenter;
  vec3 tempEye   =   eyePosition - cubeCenter;
  vec3 tempLight = lightPosition - cubeCenter;
  float aboutXAngle = 0.3123 * time;
  float cosAngle = cos(aboutXAngle);
  float sinAngle = sin(aboutXAngle);
  pointPosition.z = (tempPoint.z * cosAngle) - (tempPoint.y * sinAngle);
  pointPosition.y = (tempPoint.y * cosAngle) + (tempPoint.z * sinAngle);
  eyePosition.z   = (tempEye.z   * cosAngle) - (tempEye.y   * sinAngle);
  eyePosition.y   = (tempEye.y   * cosAngle) + (tempEye.z   * sinAngle);
  lightPosition.z = (tempLight.z * cosAngle) - (tempLight.y * sinAngle);
  lightPosition.y = (tempLight.y * cosAngle) + (tempLight.z * sinAngle);

  // Rotate around z-axis,
  tempPoint = pointPosition;
  tempEye   =   eyePosition;
  tempLight = lightPosition;
  float aboutZAngle = time;
  cosAngle = cos(aboutZAngle);
  sinAngle = sin(aboutZAngle);
  pointPosition.x = (tempPoint.x * cosAngle) - (tempPoint.y * sinAngle);
  pointPosition.y = (tempPoint.y * cosAngle) + (tempPoint.x * sinAngle);
  eyePosition.x   = (tempEye.x   * cosAngle) - (tempEye.y   * sinAngle);
  eyePosition.y   = (tempEye.y   * cosAngle) + (tempEye.x   * sinAngle);
  lightPosition.x = (tempLight.x * cosAngle) - (tempLight.y * sinAngle);
  lightPosition.y = (tempLight.y * cosAngle) + (tempLight.x * sinAngle);
  
  pointPosition += cubeCenter;
  eyePosition   += cubeCenter;
  lightPosition += cubeCenter;
  
  // Ray cast,
  vec3 rayVector = pointPosition - eyePosition;
  float t = intersectCube(rayVector, eyePosition, cubeMin, cubeMax);
  
  if (t == 1000.0) {
    gl_FragColor = vec4(0.5,0.5,0.6,1.0)*abs(uv.y);
    return ;
  }
  
  vec3 intersectionPoint = eyePosition + (t * rayVector);
  vec3 normal;
  normal = getPointOnCubeNormal(intersectionPoint, cubeMin, cubeMax);
  
  // Texture,
  vec4 textureColor = vec4(getPointOnCubeTextureColor(intersectionPoint, cubeMin, cubeMax), 1.0);
  
  // Light,
  vec4 lightColor = light(
    intersectionPoint, normal, 
    lightPosition, 
    vec4(0.15, 0.15, 0.15, 1.0), 
    vec4(1.0, 1.0, 1.0, 1.0), 
    vec4(0.8, 0.8, 0.8, 1.0),
    40.0);
    
  gl_FragColor = textureColor * lightColor;
}
