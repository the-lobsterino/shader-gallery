#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
float n = 10.0;
const float PI = 3.1415926535897932384626433832795;
const float PI_2 = 1.57079632679489661923;


void main( void ) {

	vec2 p = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);
	
	
	for(float i = 0.0; i < 10.0; i += 1.0){
		float theta = PI_2 / n * i;
		float x = sin(theta);
		float y = cos(theta);
		vec3 c = vec3(0.5 / length(vec2(x, y)));
		gl_FragColor = vec4(c, 0.5);
	}
	

}