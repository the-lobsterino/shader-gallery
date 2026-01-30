#ifdef GL_ES
precision mediump float;
#endif

// edited by cQBs^os
uniform float time;
uniform vec2 resolution;

void main( void ) {

	// normal stuff
	vec2 position = ((gl_FragCoord.xy / resolution.y *.2 *vec2(gl_FragCoord.x, .2/mod(time*.3+gl_FragCoord.y*cos(sin(5243.5)), sin(.20)))));
	vec3 col1 = vec3(.24, .2, 0.2) * ((.70 / (abs(position.y * atan((position.y)) + cos(position.x )))));

	vec3 col = smoothstep (.8, .1, col1);

	gl_FragColor = vec4(col,1.0);
	}