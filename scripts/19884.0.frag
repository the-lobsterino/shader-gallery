#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const float pi = 3.141592653589793;
void main() { 
  vec2 p = gl_FragCoord.xy / resolution;
  p = 2.0 * p - 1.0;
  p.x *= resolution.x / resolution.y;
	#define time time * .0033 - length(p)/sin(length(p)+cos(time*0.07))
  float a = atan(p.y, p.x) / pi * 0.5 + 0.5 + time * 0.1;
  float col = sin(pow(abs(p.x), abs(sin(a * pi * 6.0))) * pi * 10.0 - time * 10.0);
  col *= sin(pow(abs(p.y), abs(sin(a * pi * 6.0))) * pi * 10.0 + time * 10.0);
  col = smoothstep(0.0, 0.01, col);
  gl_FragColor = vec4(vec3(col), 1.0);
}