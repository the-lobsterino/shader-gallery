#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265358
#define HPI (PI / 2.0)

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const float size = 0.7;


void main( void ) {
  vec2 center = resolution / 2.;
  vec2 dcp = (gl_FragCoord.xy - center) / min(center.x, center.y);
  float dist = length(dcp);
  float c = 0.0;
  float angle = atan(dcp.y, dcp.x);

  for(float i = 0.0; i < 3.0; i++){
 	float bdcp = abs(size - (dist + (0.02 + 0.03 * i) * sin(angle * 10. + time * 2.0 + i * HPI)));
	float t = 1.0 - smoothstep(0.0, 0.01, bdcp);
	  t *= sin(angle * 9. + time * (i * i) + (i + 1.0) * PI);
	  c = max(c, t);
  }
  
  gl_FragColor = vec4(sin(dcp.x), c, c, 1.0);
}