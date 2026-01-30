#extension GL_OES_standard_derivatives : enable

// random static shader made by a high schooler, plz fork and rate
// now not black and white
// random cats

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

// https://stackoverflow.com/questions/4200224/random-noise-functions-for-glsl
float rand(vec2 co){
	return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
}

void main(void) {
	vec2 position = (gl_FragCoord.xy / resolution.xy);
	vec3 color = vec3(
		rand(position * time * 1.0),
		rand(position * time * 2.0),
		rand(position * time * 3.0)
	);	
	gl_FragColor = vec4(color, 1.0);
}