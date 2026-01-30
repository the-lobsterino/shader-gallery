#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec4 checkerboard(vec2 uv, float buildingId) {
	uv.y = abs(uv.y);
	if(uv.y > sin(buildingId * 1.9) * 5.0) return mix(vec4(0.0, 0.0, 1.0, 1.0), vec4(0.0, 0.0, 0.0, 1.0), 1.0 / (1.0 + uv.y));
	uv = fract(uv);
	return ((uv.x > 0.5) != (uv.y > 0.5)) ? vec4(1.0, 1.0, 0.6, 1.0) : vec4(0.6, 0.6, 1.0, 1.0);
}

void main( void ) {
	vec2 coord = gl_FragCoord.xy;
	coord -= resolution / 2.0;
	coord /= 15.0;
	if(coord.y < 0.0) coord.x += sin(time * 4.0 + coord.y * 16.0) * coord.y * 0.05;
	float buildingId = floor(coord.x / 2.0);
	coord.y /= mix(1.3, 1.0, abs(fract(coord.x / 2.0) - 0.5));
	gl_FragColor = checkerboard(coord, buildingId) * (1.0 - abs(fract(coord.x / 2.0) - 0.5)) / (1.0 + abs(coord.y) * 3.0);
}