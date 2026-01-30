precision highp float;
uniform float time;
uniform vec2  mouse;
uniform vec2  resolution;

// thanks to: https://wgld.org/d/glsl/

const float sphereSize = 1.0;
const vec3 lightDir = vec3(-0.577, 0.577, 0.577);

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

vec3 twist(vec3 p, float power){
    float s = sin(power * p.y);
    float c = cos(power * p.y);
    mat3 m = mat3(
          c, 0.0,  -s,
        0.0, 1.0, 0.0,
          s, 0.0,   c
    );
    return m * p;
}

float random (in vec2 st) { 
    return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233))) 
                * 43758.5453123);
}

// The MIT License
// Copyright © 2013 Inigo Quilez
float noise( in vec2 p )
{
    vec2 i = floor( p );
    vec2 f = fract( p );
    
    vec2 u = f*f*(3.0-2.0*f);

    return mix( mix( random( i + vec2(0.0,0.0) ), 
                     random( i + vec2(1.0,0.0) ), u.x),
                mix( random( i + vec2(0.0,1.0) ), 
                     random( i + vec2(1.0,1.0) ), u.x), u.y);
}

float distanceFunc(vec3 p){
    float a = length(rotate(p-p.z, radians(time * 100.), vec3(1., 0., 0.)) ) - 1.;
	float b = cos(time+p.x) * .1 + sin(time - p.x * p.y) * .1;
	float d = sin(time+p.z) * .1 + sin(time + p.x * p.y) * .1;
	float c = length(twist(mod(twist(p-p.x, 8.), 2.), 16.)) - 0.8;
	float e = cos(time + p.x + p.x) + .5 + noise(vec2(time, p.z));
	float f = a + min(b, d) + e + step(a + c + d, .5);
	float g = mod(length(f), 8.);

	float j = g;

	return j;
}

vec3 getNormal(vec3 p){
    float d = .1;
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
    vec3 cPos = vec3(-16,  .0,  12.0);
    vec3 cDir = vec3(0.0,  -1.5 + cos(time)*.1, -1.0);
    vec3 cUp  = vec3(0.0,  1.0,  0.0);
    vec3 cSide = cross(cDir, cUp);
    float targetDepth = 1.;
    
    // ray
    vec3 ray = normalize(cSide * p.x + cUp * p.y + cDir * targetDepth);
    
    // marching loop
    float distance = 0.0;
    float rLen = 0.0;
    vec3  rPos = cPos;
    for(int i = 0; i < 16; i++){
        distance = distanceFunc(rPos);
        rLen += distance;
        rPos = cPos + ray * rLen;
    }
    
    // hit check
    if(abs(distance) < 1.){
        vec3 normal = getNormal(rPos);
        float diff = clamp(dot(lightDir, normal), 0.1, 1.0);
        gl_FragColor = vec4(vec3(diff, diff+cos(time*.1), .8), 1.0);
    }else{
        gl_FragColor = vec4(vec3(0.0), 1.0);
    }
}