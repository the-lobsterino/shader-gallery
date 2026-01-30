#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float rand(float x) {
	return fract(sin(x) * 100000.0);
}

float func(float x) {
	return rand(floor(x));
}
	

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy);
	
	float x = position.x * position.y * 100000.0;
	
	float f = fract(x);
	float i = floor(x);
	
	x *= 100.0;
	float c = mix(func(x), func(x + 1.0), x);
	//c = rand(x);
	gl_FragColor = vec4(c, c, c, 1.0);
}