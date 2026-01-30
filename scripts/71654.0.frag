#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main(void) {
	vec2 coord = floor(gl_FragCoord.xy / 2.0);
	vec2 res = floor(resolution.xy / 4.0);
	float t = time;
	vec2 position = (coord / res.xy) - 0.5;
	position.x += sin(time / 4.0) * 0.025 - 0.5;
	position.y += cos(time / 3.0) * 0.025 - 0.5;
	float fog = sqrt(abs(position.x)) / 1.5;
	float ylines = abs(sin((position.y * 16.0 / fog) - t * 15.0));
	float xlines = abs(sin((position.x * 8.0 / fog)- t * 15.0));
	vec3 color = vec3(fog + ylines);
	color -= xlines;
	// give the "walls" a base color
	color += vec3(2.0);
	// make it red
	color *= vec3(0.6, 0.0, 1.0);
	// fade away into the distance
	color *= fog;
	
	bool xdither = fract(coord.x / 2.0) != 0.5;
	if(!xdither) {
		color = vec3(0.25, 0.0, 0.0) * (fog + 0.5);
	}
	
	// vingette
	color *= 0.8 - abs((gl_FragCoord.x / resolution.x) - 0.5) - abs((gl_FragCoord.y / resolution.y) - 0.5);

	gl_FragColor = vec4(vec3(color), 1.0);
}