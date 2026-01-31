#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	float t = time;
	// t = smoothstep(0.0, 1.0, t);
	
	vec2 coords = (gl_FragCoord.xy / resolution.xy) * 2.0 - 1.0;
	float x = coords.x;
	float y = coords.y;
	
	float s = (sin(sqrt(x*x + y*y) * 10.0 - (time * 5.0)) / sqrt(x*x + y*y)) * 0.5 + 0.5;
		
	vec3 color = vec3(x * 0.5 + 0.5, 0.0, y * 0.5 + 0.5);
	// color = vec3(1);
	gl_FragColor = vec4(color * s,  1.0);
}