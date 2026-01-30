#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

#define COLOR vec3(1.0, 0.0, 0.0)
#define HALF_TICK 0.01
#define M_PI   3.14159265358979323846

uniform vec2 resolution;
uniform float time;

vec3 plot_y(vec2 pos, float y, vec3 color) {
  return  ( smoothstep( y-HALF_TICK, y, pos.y ) - smoothstep( y, y+HALF_TICK, pos.y )) * color;
}

void main() {

  vec2 pos = gl_FragCoord.xy / resolution.xy;
	
  float x = pos.x;
  float y = sqrt(x);

  float amp = 1.0;
  float freq = 2.0;

  y = sin(2.0 * M_PI * freq /* * time */ * pos.x + 0.0);
  
  gl_FragColor = vec4( plot_y(pos, y, COLOR) , 1.0);
}