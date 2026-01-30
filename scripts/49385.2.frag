#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy );
	gl_FragColor = vec4(position.x, position.y, 0.0, 1.0);
	
	vec2 points[5];
	points[0] = vec2(0.2, 0.2);
	points[1] = vec2(0.2, 0.8);
	points[2] = vec2(0.8, 0.2);
	points[3] = vec2(0.8, 0.8);
	points[4] = vec2(0.5, 0.5);
	
	float value = 0.0;
	for (int i = 0; i < 5; i++) {
		value += sin(distance(position, points[i]) * 100.0 - (time * 5.0));
	}
	
	gl_FragColor = vec4(vec3((value / 5.0 + 1.0) / 2.0), 1.0);
}