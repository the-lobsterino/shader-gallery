// co3moz
// rotational square example

precision mediump float;
uniform float time;
uniform vec2 resolution;

void main(void) {
	mat2 rotation = mat2(cos(time), -sin(time), sin(time), cos(time));
	vec2 aspect = resolution.xy / min(resolution.x, resolution.y);
	vec2 position = (gl_FragCoord.xy / resolution.xy) * aspect;
	vec2 center = vec2(0.5) * aspect;
	
	position *= rotation;
	center *= rotation;

	float size = 0.25;
	
	gl_FragColor = vec4(vec3(length(position.x - center.x) < size && length(position.y - center.y) < size), 1.0);
}