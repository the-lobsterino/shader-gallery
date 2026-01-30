#ifdef GL_ES
precision mediump float;
#endif

precision mediump float;
uniform float time;
uniform vec2  mouse;
uniform vec2  resolution;

const float PI = 3.14159265;
const float angle = 60.0;
const float fov = angle * 0.5 * PI / 180.0;
vec3  cPos = vec3(0.0, 0, 5);
const float sphereSize = 1.0;
const vec3 lightDir = vec3(-0.577, 0.577, 0.577);

vec3 trans(vec3 p){
	return mod(p, 4.0) - 2.0;
}

// rotate
vec3 rotate(vec3 p, float angle, vec3 axis){
    vec3 a = normalize(axis);
    float s = sin(angle);
    float c = cos(angle);
    float r = 1.0 - c;
    mat3 m = mat3(
        a.x * a.x * r + c,
        a.y * a.x * r + a.z * s,
        a.z * a.x * r - a.y * s,
        a.x * a.y * r - a.z * s,
        a.y * a.y * r + c,
        a.z * a.y * r + a.x * s,
        a.x * a.z * r + a.y * s,
        a.y * a.z * r - a.x * s,
        a.z * a.z * r + c
    );
    return m * p;
}

const float R = 0.5;
const float posX = 0.0;
float distanceTriPrism(float px,float py){
  float d1= -px-R;
  float d2= -cos(2.0*PI/3.0)*(px)+sin(2.0*PI/3.0)*py-R;
  float d3= -cos(4.0*PI/3.0)*(px)+sin(4.0*PI/3.0)*py-R;
  return max(d1, max(d2,d3));
}
	

float distSphere(vec3 p, vec3 sPos, float r){
	sPos = sPos - p;
	return length(sPos) - r;
}

float distanceS2(vec3 p, float zb, float zc){
 	float r2 = 0.5 + (zb * zc) / 3.0;
  	vec3 c2 = vec3(r2, 0, 0);
	return distSphere(p, c2, r2);
}

float distanceS4(vec3 p, float zb, float zc){
 	float r4 = 0.5 + (zb * zb)/3.0 - (zb * zc)/3.0;
  	vec3 c4 = vec3(-(1.0 - r4)/2.0, sqrt(3.0) * (1.0 - r4)/2.0, zb);
	return distSphere(p, c4, r4);
}

float distanceS6(vec3 p, float zb, float zc){
 	float r6 = 0.5 - (zb * zc)/3.0 + (zc * zc)/3.0;
  	vec3 c6 = vec3(-(1.0 - r6)/2.0, -sqrt(3.0) * (1.0 - r6)/2.0, zc);
	return distSphere(p, c6, r6);
}

float distFuncFloor(vec3 p){
    return dot(p, vec3(0.0, 1.0, 0.0)) + 300.0;
}

const float zb = 0.0;

float distanceF(vec3 a){
a = rotate(a, radians(time * 10.0), vec3(0.3, 0.4, 0.8));
 float zc = sqrt(3.0)/2.0;

 float ret3=distanceTriPrism(a.x, a.y);
 return max(0.0,max(ret3,max(-distanceS2(a, zb, zc),max(-distanceS4(a, zb, zc), -distanceS6(a, zb, zc)))));
//return min(distanceS2(a, zb, zc),min(distanceS4(a, zb, zc), distanceS6(a, zb, zc)));
}


vec3 getNormal(vec3 p){
    float d = 0.005;
    return normalize(vec3(
        distanceF(p + vec3(  d, 0.0, 0.0)) - distanceF(p + vec3( -d, 0.0, 0.0)),
        distanceF(p + vec3(0.0,   d, 0.0)) - distanceF(p + vec3(0.0,  -d, 0.0)),
        distanceF(p + vec3(0.0, 0.0,   d)) - distanceF(p + vec3(0.0, 0.0,  -d))
    ));
}

void main(void){
    // fragment position
    vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
    
    // ray
    vec3 ray = normalize(vec3(sin(fov) * p.x, sin(fov) * p.y , -cos(fov)));	
    
    // marching loop
    float distance = 0.0;
    float rLen = 0.0;
    vec3  rPos = cPos;
    for(int i = 0; i < 150; i++){
        distance = distanceF(rPos);//distanceFunc(rPos);
        rLen += distance;
        rPos = cPos + ray * rLen;
    }
    
    // hit check
    if(abs(distance) < 0.001){
        vec3 normal = getNormal(rPos);
        float diff = clamp(dot(lightDir, normal), 0.1, 1.0);
        gl_FragColor = vec4(vec3(diff), 1.0);
    }else{
        gl_FragColor = vec4(vec3(0.0), 1.0);
    }

}