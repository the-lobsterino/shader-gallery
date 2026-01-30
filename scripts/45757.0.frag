#ifdef GL_ES
precision mediump float;
#endif



uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2  screen;

vec4  I;
vec4  Ia  = vec4(  0.05,  0.05,  0.05, 1.0);
vec4  Id1 = vec4(  0.15,  0.35,  0.75, 1.0);
vec4  Id2 = vec4(  0.01,  0.1,  0.01, 1.0);
vec4  L1  = vec4(  0.8,   0.8,   1.74, 1.0);
vec4  L2  = vec4( -0.3,  -0.8,   0.,  1.0);
vec4  N;
float Lb1, Lb2;
vec4  Is1 = vec4(0.1, 0.1, 0.1, 1.0);
vec4  Is2 = vec4(0.1, 0.1, 0.1, 1.0);
vec4  E  = vec4(0.0, 0.0, 0.0, 1.0);
vec4  R1, R2;

float scale   = 1.0;
vec4  f       = vec4(0.4, 0.4, 0.4, 1.0);
vec4  b       = vec4(0.0, 0.6, 0.8, 1.0);

#define AA_MIN 0.986

void main( void ) {
 vec2  	p = (gl_FragCoord.xy * scale - resolution / 2.0) / min(resolution.x / 2.0, resolution.y / 2.0);
 float  x = p.x;
 float  y = p.y;
 float  c = x*x + y*y;

 float  z = sqrt(1.0 - c);
 
 N  = vec4(x, y, z, 1.0);
 L1 = normalize(L1);
 L2 = normalize(L2);
 Lb1 = max(dot(N, L1),0.0);
 Lb2 = max(dot(N, L2),0.0);
 
 Id1 *= Lb1;
 Id2 *= Lb2;
 R1 = reflect(-L1, N);
 R2 = reflect(-L2, N);
 Is1 *= pow(max(dot(R1,E), 0.0), 3.4);
 Is2 *= pow(max(dot(R2,E), 0.0), 1.4);
 I   = Ia + +Id1 + Id2 + Is1 + Is2;
 float a = smoothstep(1.0, AA_MIN, c);
 gl_FragColor = f * I * a;
}