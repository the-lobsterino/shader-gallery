#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const float sphereSize = 1.0;
const vec3 lightDir = vec3(-0.577, 0.577, 0.577);
const float PI = 3.14159265;
const float angle = 60.0;
const float fov = angle * 0.5 * PI / 180.0;


float smoothMin(float d1, float d2, float k){
    float h = exp(-k * d1) + exp(-k * d2);
    return -log(h) / k;
}

vec3 trans(vec3 p){
    return mod(p, 6.0) - 3.0;
}

float distanceFuncA(vec3 p){
  float d1 = length(trans(p) + vec3(sin(mod(time*2.0, PI*2.0))/1.5, cos(mod(time*3.0, PI*2.0))/2.0, 0.0)) - sphereSize;
  float d2 = length(trans(p) + vec3(cos(mod(time/2.0, PI*2.0))/2.0, sin(mod(time, PI*2.0))/1.5, 0.0)) - sphereSize;
  return smoothMin(d1, d2, 5.0);
}

float distanceFuncB(vec3 p){
    return length(max(abs(trans(p)) - vec3(abs(sin(mod(time*1.0, PI*2.0))))*0.8, 0.0));
}

float distanceFunc(vec3 p){
  float d1 = distanceFuncA(p);
  float d2 = distanceFuncB(p);
  return smoothMin(d1, d2, 8.0);
}

vec3 getNormal(vec3 p){
    float d = 0.0001;
    return normalize(vec3(
        distanceFunc(p + vec3(  d, 0.0, 0.0)) - distanceFunc(p + vec3( -d, 0.0, 0.0)),
        distanceFunc(p + vec3(0.0,   d, 0.0)) - distanceFunc(p + vec3(0.0,  -d, 0.0)),
        distanceFunc(p + vec3(0.0, 0.0,   d)) - distanceFunc(p + vec3(0.0, 0.0,  -d))
    ));
}

void main(void){
    vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);

    //vec3 cPos = vec3(0.0,  0.0,  3.0);
    vec3 cPos = vec3(0.0,  0.0,  pow(cos(mod(time/4.0, PI*2.0)), 2.0)*5.0+2.0);
    vec3 cDir = vec3(0.0,  0.0, -1.0);
    //vec3 cUp  = vec3(0.0, 1.0,  0.0);
    vec3 cUp  = vec3(pow(cos(mod(time/4.0, PI*2.0)), 2.0), pow(sin(mod(time/4.0, PI*2.0)), 2.0),  0.0);
    vec3 cSide = cross(cDir, cUp);
    float targetDepth = 1.0;
    
    //vec3 ray = normalize(vec3(sin(fov) * p.x, sin(fov) * p.y, -cos(fov)));
    vec3 ray = normalize(cSide * p.x + cUp * p.y + cDir * targetDepth);
    
    float distance = 0.0;
    float rLen = 0.0;
    vec3  rPos = cPos;
    float minDis = 10000.0;
    for(int i = 0; i < 64; i++){
        distance = distanceFunc(rPos);
        rLen += distance;
        rPos = cPos + ray * rLen;
        minDis = min(minDis, abs(distance));
	if(abs(distance) < 0.01) break;
    }
    
    if(minDis < 10.0){
        vec3 lightColor = vec3(abs(cos(mod(time, PI*2.0))), abs(sin(mod(time, PI*2.0))), abs(cos(mod(time/0.5, PI*2.0))));
        vec3 normal = getNormal(rPos);
        float diff = clamp(dot(lightDir, normal), 0.1, 1.0);
        gl_FragColor = vec4(vec3(diff)*lightColor*10.0/rLen, 1.0);
	if(abs(distance) > 0.01) {
            gl_FragColor.rgb *= minDis*50.0;
	}
    } else {
        gl_FragColor = vec4(vec3(0.1), 1.0);
    }
}