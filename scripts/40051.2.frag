#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define PI 3.14159265359
#define TWO_PI 6.28318530718

void main( void ) 
{
  vec2 p = 2. * ((gl_FragCoord.xy / resolution.y) * 2.0 - 1.0);
  float t = 3.*abs(sin(time)*3.);	
  p = fract(0.7*p)-0.5;                   // mirrors
  float d = 2.*length(p);                     // distance
  float a = t + 3.0 * atan(p.x, p.y);   // angle
  float r = 0.5 + 0.2 * pow(cos(a), 0.08); // radius
  float f = smoothstep(d, d+0.012, r);     // aa
  vec3 col = mix(vec3(1.0), vec3(0.9, 0.7, 0.0), f);
  gl_FragColor = vec4 ( col, 1.0);
}

// add gtr