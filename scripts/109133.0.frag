#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const float sphereSize = 1.0; // 球の半径
const vec3 lightDir = vec3(-0.577, 0.577, 0.577);

const float PI = 3.14159265;
const float angle = 60.0;
const float fov = angle * 0.5 * PI / 180.0;




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

// smoothing min
float smoothMin(float d1, float d2, float k){
    float h = exp(-k * d1) + exp(-k * d2);
    return -log(h) / k;
}

// torus
float distFuncTorus(vec3 p, vec2 r){
    vec2 d = vec2(length(p.xy) - r.x, p.z);
    return length(d) - r.y;
}

// box
float distFuncBox(vec3 p){
    return length(max(abs(p) - vec3(2.0, 44.1, 0.5), 0.0)) - 0.1;
}

// cylinder
float distFuncCylinder(vec3 p, vec2 r){
    vec2 d = abs(vec2(length(p.xy), p.z)) - r;
    return min(max(d.x, d.y), 0.0) + length(max(d, 0.0)) - 0.1;
}

// distance function
float distanceFunc(vec3 p){
    vec3 q = rotate(p, radians(time * 10.0), vec3(1.0, 0.5, 0.0));
    float d1 = distFuncTorus(q, vec2(1.5, 0.25));
    float d2 = distFuncBox(q);
    float d3 = distFuncCylinder(q, vec2(0.75, 0.25));
    return smoothMin(smoothMin(d1, d2, 16.0), d3, 16.0);
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
    // fragment position
    vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
    
    // camera
    
    vec3 cPos = vec3(0.0,  0.0,  -5.0);
    float screenZ =2.5;
    // ray
    vec3 ray = normalize(vec3(p,screenZ));
    
    // marching loop
    float dist = 0.0; 
    float rLen = 0.0;     
 
    vec3 col =vec3(0.0);
    for(int i = 0; i < 99; i++)
    {
      vec3 rPos = cPos + ray * rLen;
           dist = distanceFunc(rPos);
      vec3 normal = getNormal(rPos);
      float diff = clamp(dot(lightDir,normal),0.1,1.0);
    
    // hit check
    if(abs(dist) < 0.001)
    {
	   
        col =vec3(diff);
      break;
     }
	rLen += dist;
    }

gl_FragColor = vec4(col, 1.0);}