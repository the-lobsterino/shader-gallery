precision mediump float;
uniform float time;
uniform vec2  mouse;
uniform vec2  resolution;

const float sphereSize = 2.0;
const vec3 lightDir = vec3(-0.577, 0.577, 0.577);

#define repeat(p, span) mod(p, span) - (0.5 * span)


float distanceFunc(vec3 p){
    return length(p) - sphereSize;
}

// rotate
mat2 rot(float a) {
    float c = cos(a), s = sin(a);
    return mat2(c,s,-s,c);
}

// sphere distance func
float distanceSphere(vec3 p, float r){
    return length(p) - r;
}

// plane distance func
float distancePlane(vec3 p) {
  return p.y;
}

// box distance func
float distanceBox(vec3 p, float s) {
  p = abs(p) - s;
  return max(max(p.x, p.y), p.z);
}

float sdBox(vec3 p, vec3 b)
{
    return length(max(abs(p) - b, 0.0));
}

// box Iterated function system
float IteratedBox(vec3 p)
{
    float d = 1e5;
    for(int i=0; i<4; i++) {
      p = abs(p) - 1.; // Fold
      p.xz *= rot(1.); // 回転
      p.xy *= rot(1.); // 回転
    }
    d = min(d, distanceBox(p, 0.5));

    return d;
}



float map(vec3 p)
{
    vec3 z = p;
    float pi = acos(-1.0);

    float scale = 2.0;
    float sum = scale;
    float d = 1e5;

    for (float i = 0.; i < 4.0; i++)
    {
        float td = sdBox(z, vec3(0.5)) / sum;

        z = abs(z) - vec3(0, 2.0, 0);
        d = min(td, d);

        z.xy *= rot(pi * 0.25);
        z *= scale;
        sum *= scale;
    }

    return d;
}

vec2 pmod(vec2 p, float r) {
    float pi = acos(-1.0);
    float pi2 = pi *2.0;
    float a =  atan(p.x, p.y) + pi/r;
    float n = pi2 / r;
    a = floor(a/n)*n;
    return p*rot(-a);
}

void main(void){
    // fragment position
    vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
    
    vec3 cameraPos = vec3(0., 0., -10.); // camera
    float screenZ = 1.5; // fov
    //vec3 rayDirection = normalize(vec3(pmod(p,5.0), screenZ)); // 多角形をつくれる
    vec3 rayDirection = normalize(vec3(p, screenZ)); // ray

    vec3 col = vec3(0.0);

    float depth = 0.0;
    for(int i = 0; i < 100; i++) {
      vec3 rayPos = cameraPos + rayDirection * depth;
      float dist = distanceBox(rayPos, 0.5);
      
      if(dist < 0.00001) {
        col = vec3(1.0);
        break;
      }

      depth += dist;
    }

    gl_FragColor = vec4(col,  1.0);
}