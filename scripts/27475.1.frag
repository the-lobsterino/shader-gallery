#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const float PI = 3.14159265;
const float angle = 60.0;
const float fov = angle * 0.5 * PI / 180.0;
vec3  cPos = vec3(0.0, 0.0, 2.0);
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

const int Iterations = 3;
float Bailout = 6.;
float Power = 4.;
float distanceFunc(vec3 pos) {
   pos = rotate(pos, radians(time * 30.), vec3(1.5, 0.4, 0.));
   vec3 z = pos;
   float dr = 1.0;
   float r = 0.0;
   for (int i = 0; i < Iterations ; i++) {
   r = length(z);
   if (r>Bailout) break;
   // convert to polar coordinates
   float theta = acos(z.z/r);
  float phi = atan(z.y,z.x);
  dr = pow( r, Power-1.0)*Power*dr + 1.0;
  // scale and rotate the point
  float zr = pow( r,Power);
  theta = theta*Power;
  phi = phi*Power;
  // convert back to cartesian coordinates
  z = zr*vec3(sin(theta)*cos(phi), sin(phi)*sin(theta), cos(theta));
  z+=pos;
  }
  return 0.5*log(r)*r/dr;
}

vec3 getNormal(vec3 p){
    float d = 0.001;
    return normalize(vec3(
        distanceFunc(p + vec3(  d, 0.0, 0.0)) - distanceFunc(p + vec3( -d, 0.0, 0.0)),
        distanceFunc(p + vec3(0.0,   d, 0.0)) - distanceFunc(p + vec3(0.0,  -d, 0.0)),
        distanceFunc(p + vec3(0.0, 0.0,   d)) - distanceFunc(p + vec3(0.0, 0.0,  -d))
    ));
}

void main(void)
{
    vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
    vec3 ray = normalize(vec3(sin(fov) * p.x, sin(fov) * p.y, -cos(fov)));	
    
    float distance;
    float rLen = 0.0;
    vec3  rPos = cPos;
    int i2 = 0;
    for(int i = 0; i < 64; ++i){
        distance = distanceFunc(rPos);
        rLen += distance * 1.0;
        rPos = cPos + ray * rLen;
	i2 = i;
        if(abs(distance) < 0.001){
            break;
        }
    }
    
    // hit check
    if(abs(distance) < 0.001){
        vec3 normal = getNormal(rPos);
        float diff = clamp(dot(lightDir, normal), 0.1, 1.0);
        gl_FragColor = vec4(vec3(diff), 1.0);
//        gl_FragColor.r *= (1.0 - float(i2) / 64.0);
//        gl_FragColor.g *= (rPos.z);
//        gl_FragColor.b *= (1.0 - rPos.x);
        gl_FragColor.r *= (1.0 - float(i2) / 32.0);
        gl_FragColor.g *= (1.0 - float(i2) / 32.0);
    }else{
        gl_FragColor = vec4(vec3(0.0), 1.0);
    }
}
