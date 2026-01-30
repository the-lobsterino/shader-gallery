#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const int   N   = 10;
const float eps = 1e-7;

vec3 c_back  = vec3(0,0,0);
vec3 c_front = vec3(1,1,1);

void main( void ) {
 vec2        pix = vec2(1.0, 1.0) / resolution.xy;
 vec2        p = gl_FragCoord.xy / resolution.xy;
 vec2        v = vec2(1.0, 1.0);
 float       t = 0.0;
 const float e = .3 + eps;
 vec2        r;
	
 for(float i = 0.0; i < e; i += 0.01){
  r = i * v;
  r = abs(r - p);
  t = smoothstep(0.0, 1.0, length(r));
  if((r.x <= pix.x) && (r.y <= pix.y)){
   gl_FragColor = vec4(mix(c_front, c_back, t), 1.0);
   return;
  }
 }
}