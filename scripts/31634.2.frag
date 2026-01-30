#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define WIDTH .1


//float time = 2.1;

float ring(vec2 p, float r) {
  return 1.-clamp(dot(abs(length(p)-r), resolution.x * WIDTH), 0., 1.);
}

void main( void ) {
  vec2 uv = gl_FragCoord.xy/resolution.xy;
  vec2 p = (uv * 2. - 1.) * resolution.xy/resolution.yy;
	
  float r=0.0;
	
  r += ring(p, sin(time));
		
  gl_FragColor = vec4(r);
}