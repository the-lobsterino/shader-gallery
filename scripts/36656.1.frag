// FlowerDf2 by aiekick 
// original:   https://www.shadertoy.com/view/4tdXRM
    
#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define TWO_PI 6.28

#define SEGMENTS 7.0

void main( void ) 
{
  vec2 uv = (gl_FragCoord.xy * 2. - resolution.xy) / resolution.y;

  float t = sin(time*0.2);
  float a = atan(uv.x, uv.y) / TWO_PI * SEGMENTS;
  float d = length( uv) - mix(3.*sin(3.*t),.5, cos(fract(a)-.5));
    
  vec3 col = vec3(1.0) - sign(d)*vec3(0.1,0.4,0.7);
  col *= 1.0 - exp(-2.0*abs(d));
  col *= 0.8 + 0.2*cos(120.0*abs(d) + t*10.);
  col = mix( col, vec3(1.0), 1.0 - smoothstep(0.0,0.02, abs(d)));

  gl_FragColor = vec4( col, 1.0 );
}
