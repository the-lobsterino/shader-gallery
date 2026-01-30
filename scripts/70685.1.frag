#ifdef GL_ES
precision mediump float;
#endif
#extension GL_OES_standard_derivatives : enable

uniform vec2  resolution;

const int   MARCH_STEPS = 64;
const float EPS = 0.0001;
const float PI = 3.14159265;

const vec3  ambientLightDir	= normalize(vec3(0.5, 1, -.8));
const vec4  ambientLightColor	= vec4(1., 1., 1., 1.);

float angle = 60.0;
float fov = angle * 0.5 * PI / 180.0;
vec3  cameraPos = vec3(0.0, 0.6, -3.);

// Primitive SDFs
float sdfSphere(vec3 p, float r)
{
	return length(p) - r;
}

float sdfBox(vec3 p, vec3 b)
{
  vec3 q = abs(p) - b;
  return length(max(q,0.0)) + min(max(q.x,max(q.y,q.z)),0.0);
}

float sdfPyramid( vec3 p, float h)
{
  float m2 = h*h + 0.25;
    
  p.xz = abs(p.xz);
  p.xz = (p.z>p.x) ? p.zx : p.xz;
  p.xz -= 0.5;

  vec3 q = vec3( p.z, h*p.y - 0.5*p.x, h*p.x + 0.5*p.y);
   
  float s = max(-q.x,0.0);
  float t = clamp( (q.y-0.5*p.z)/(m2+0.25), 0.0, 1.0 );
    
  float a = m2*(q.x+s)*(q.x+s) + q.y*q.y;
  float b = m2*(q.x+0.5*t)*(q.x+0.5*t) + (q.y-m2*t)*(q.y-m2*t);
    
  float d2 = min(q.y,-q.x*m2-q.y*0.5) > 0.0 ? 0.0 : min(a,b);
    
  return sqrt( (d2+q.z*q.z)/m2 ) * sign(max(q.z,-p.y));
}

// Main SDF
float sceneSDF(vec3 p){
	return min(min(sdfSphere(p-vec3(0.7, -0.5, -0.3), 0.3), sdfBox(p, vec3(0.3))), sdfPyramid(p-vec3(-1.0, 0.5, 1.), 0.8));
}

// Utils
vec4 getBackGroundColor(vec3 p){
	return vec4(0.5, 0.5, 0.5, 1.);
}

vec3 getNormal(vec3 p){
    return normalize(vec3(
        sceneSDF(p + vec3(EPS, 0.0, 0.0)) - sceneSDF(p + vec3(-EPS, 0.0 , 0.0)),
        sceneSDF(p + vec3(0.0, EPS, 0.0)) - sceneSDF(p + vec3(0.0 , -EPS, 0.0)),
        sceneSDF(p + vec3(0.0, 0.0, EPS)) - sceneSDF(p + vec3(0.0 , 0.0 , -EPS))
    ));
}

float halfLambart(vec3 normal, vec3 ambient_light_direc){
	float tmp = dot(normal, ambient_light_direc) * 0.5 + 0.5;
	return pow(tmp, 2.);
}

vec4 getDiffuseRadiance(vec3 p) {
	vec3 normal = getNormal(p);
	return vec4(vec3(halfLambart(normal, ambientLightDir)), 1.0);
}

void main( void ) {
	// Fragment Position
	vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
	// Ray Direction
	vec3 ray = normalize(vec3(sin(fov) * p.x, sin(fov) * p.y, cos(fov)));	
    
	// Marching Loop
	float dist;
   	float rLen = 0.0;
   	vec3  rPos = cameraPos;
	vec4 diffuseColor = vec4(1., 1., 1., 1.);
   	for(int i = 0; i < MARCH_STEPS; i++){
		dist = sceneSDF(rPos);
		rLen += dist;
		rPos = cameraPos + ray * rLen;
		// Hit Check
		if(abs(dist) < EPS){
			gl_FragColor = ambientLightColor * diffuseColor * getDiffuseRadiance(rPos);
			return;
		}
  	}
	// No Hit
	gl_FragColor = getBackGroundColor(rPos); 
}