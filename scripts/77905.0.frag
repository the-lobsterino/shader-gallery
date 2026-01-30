precision mediump float;
uniform float time;
uniform vec2  mouse;
uniform vec2  resolution;

const float sphereSize = 0.3;
const vec3 lightDir = vec3(1.0,0.0,-2.0);
const float PI = 3.14159265;
const float angle = 60.0;
const float fov = angle * 0.5 * PI / 180.0;

mat2 rot(float a) {
    float c = cos(a), s = sin(a);
    return mat2(c,s,-s,c);
}

float sdBox(vec3 p, vec3 b)
{
    return length(max(abs(p) - b, 0.0));
}


mat3 rot3z(float a) {
    float c = cos(a), s = sin(a);
    return mat3(c,-s,0.,s,c,0.,0.,0.,1.);
}

vec3 trans(vec3 p) {
  float x = 4.0;
  return (mod(p, x) - x/2.);
}

float distanceFunc(vec3 p){
    float b = 2.0;
    float s = 0.28;
    vec3 q = abs(trans(p) *rot3z(-time*0.4)*0.5);
    float xAxis = sdBox(q, vec3(s,s,s)) - 0.01;
    float yAxis = sdBox(q,vec3(s, s, b)) - 0.05;
    float zAxis = sdBox(q,vec3(s, s, s)) - 0.001;
    return min(min(xAxis, yAxis), zAxis);
}

vec3 getNormal(vec3 p){
    float d = 0.001;
    return normalize(vec3(
        distanceFunc(p + vec3(  d, 0.0, 0.0)) - distanceFunc(p + vec3( -d, 0.0, 0.0)),
        distanceFunc(p + vec3(0.0,   d, 0.0)) - distanceFunc(p + vec3(0.0,  -d, 0.0)),
        distanceFunc(p + vec3(0.0, 0.0,   d)) - distanceFunc(p + vec3(0.0, 0.0,  -d))
    ));
}

vec3 onRep(vec3 p, float interval) {
  return mod(p, interval) - interval * 0.5;
}


void main(void){
    // fragment position
    vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
    
    // camera
    vec3 cPos = vec3(2.0*time,  time*.5,0.0);
    vec3 cDir = vec3(1.0, 1.0, 1.0);
    vec3 cUp  = vec3(2.0,  2.0,  1.0);
    vec3 cSide = cross(cDir, cUp);
    float targetDepth = 1.0;
    
    // ray
    //vec3 ray = normalize(cSide * p.x + cUp * p.y + cDir * targetDepth)*rot3z(time*0.2);
    vec3 ray = normalize(vec3(sin(fov) * p.x, sin(fov) * p.y, -cos(fov)))*rot3z(time*0.8);

    // marching loop
    float distance = 0.0;
    float rLen = 0.0;
    vec3  rPos = cPos; 
    for(int i = 0; i < 224; i++){
        distance = max(abs(distanceFunc(rPos)), 0.02); // Phantom Mode
        rLen += exp(-distance * 6.);
        rPos = cPos + ray * rLen;
    }
    
    // hit check
    vec3 color;
    vec3 normal = getNormal(rPos);
    float diff = clamp(dot(normalize(lightDir), normal), 0.1, 1.0);
    color = vec3(1.0,0.1,0.1)*diff;
    
    gl_FragColor = vec4(color + 0.005 * rLen, 1.0);

}