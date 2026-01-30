#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;

void main(void) {
  float aspectRatio = resolution.x / resolution.y;
  vec2 strobePosition = ((gl_FragCoord.xy / resolution.xy) * 2.0 - 1.0);
  vec2 uv = gl_FragCoord.xy / resolution;
  vec3 color = vec3(0.0);
	
  float strobeTime = ((sin(time * 0.9) + 1.5)) / 30.0;
  strobePosition.x *= aspectRatio;

  const vec2 strobeSlide = vec2(0.0, 0.0);
  const vec3 strobeColor = vec3(0.14, 0.06, 0.17);
  color += strobeColor * (1.0 / distance(strobeSlide, strobePosition) * 21.0) * strobeTime;
  color += strobeColor * (1.0 / distance(strobePosition.y, 0.0) * 5.0) * strobeTime;

  gl_FragColor = vec4(color, 1.0);
}