#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = gl_FragCoord.xy / resolution.xy * 2.0 - 1.0;
	
	vec2 nuv = position * 3.0;
	vec2 c = nuv;
	float k = 0.0;
	const int steps = 64;
	
	for (int i = 0; i < steps; i++) {
		
		k++;
		
		if (length(nuv) > 4.0) {
			break;
		}
		
		nuv = vec2(nuv.x * nuv.x - nuv.y * nuv.y, nuv.x * nuv.y * 2.0) + c;
	}
	
	vec3 color = vec3(k / float(steps));

	gl_FragColor = vec4(color, 1.0 );

}