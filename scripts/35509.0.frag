#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform vec3 spectrum;
uniform sampler2D texture0;

varying vec2 v_texcoord;

// https://gist.github.com/patriciogonzalezvivo/670c22f3966e662d2f83
vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }

float snoise(vec2 v){
  const vec4 C = vec4(0.211324865405187, 0.366025403784439,
           -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy) );
  vec2 x0 = v -   i + dot(i, C.xx);
  vec2 i1;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
  + i.x + vec3(0.0, i1.x, 1.0 ));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
    dot(x12.zw,x12.zw)), 0.0);
  m = m*m ;
  m = m*m ;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

vec3 hsv2rgb(vec3 c){
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

float rand(float n){return fract(sin(n) * 43758.5453123);}

// 
float fbm(vec2 P, const int octaves, float lacunarity, float gain){
    float sum = 0.0;
    float amp = 1.0;
    vec2 pp = P;
     
    for(int i = 0; i < 10; i+=1){
        amp *= gain; 
        sum += amp * snoise(pp);
        pp *= lacunarity;
    }
    return sum;
}

vec3 blendNormal(vec3 base, vec3 blend) {
    return blend;
}

vec3 blendNormal(vec3 base, vec3 blend, float opacity) {
    return (blendNormal(base, blend) * opacity + base * (1.0 - opacity));
}

void main(void){   

    vec2 p = gl_FragCoord.xy / resolution.xy;
    float n =  snoise(p*2.4);
    float n2 = fbm(p*4.-time/40.0, 10, 2.0, 0.7);

    

    n = (n+1.)/2.;
    n2 = (n2+1.)/2.;
    n = mix(n, n2, 0.4);

    float th = 0.5;
    vec3 rgb = vec3(0.0);
    

    rgb = vec3(0 , n, n*.9);
    rgb.g = (n > th)? n*1.4: 0.0;


    rgb.rg += (n > th+0.2)
        ? vec2(n, n)
        : vec2(0.0, 0.0);
    
    
    float c = (snoise(p*0.4)-0.3)*2.0;
    c += fbm(p*5.+time/40.0, 8, 2.0+sin(time/500.0)*.5+0.5, 0.6);
    c = max(c, 0.0);
    vec3 cloud = vec3(c);
    rgb = blendNormal(rgb, cloud, 0.5);


    vec4 col = vec4(rgb, 1.0);


    gl_FragColor = col;
}