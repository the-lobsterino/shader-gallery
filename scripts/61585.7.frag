#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 resolution;

float roundedRectangle (vec2 pos, vec2 size, float radius) {
  float d = length(max(abs(.5 - pos),size) - size) - radius;
  return smoothstep(0.66, 0.33, d / .005);
}

vec3 color = vec3(0);
vec2 uv = vec2(0);
float aspect = resolution.x / resolution.y;
vec2 ratio = vec2(aspect, 1.);

void main(void) {
	vec2 npos = gl_FragCoord.xy / resolution;
	uv = .5 + (2.0 * npos - 1.0) * ratio;
    	uv = fract(vec2(uv.x * 10., uv.y * 10.));
	
	const vec3 rectColor = vec3(0., 1., .5);
	float intensity = roundedRectangle(uv, vec2(.5) * .5, .01);
	color = mix(color, rectColor, intensity);
	
	color = mix(color, vec3(uv.x - .5), uv.x);
	
	gl_FragColor = vec4(color, 1);
}