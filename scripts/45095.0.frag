#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	//vec2 position = ( gl_FragCoord.xy / resolution.xy ) + mouse / 4.0;
	vec2 position = ( gl_FragCoord.xy / resolution.xy);
	
	float a = cos(gl_FragCoord.x * 0.005 + 13.2 ) + 1.5;
	float b = sin(gl_FragCoord.y * 0.005 - 1.5) + 0.0;
	
	float aa = a * a;
	float bb = b * b;	
	
	
	float ab = 0.5 - floor(aa + bb);
	
	gl_FragColor = vec4(vec3(ab * 1.0 * ( 1.+ sin(time) * 0.5)) * vec3(cos(time),sin(time ),0.5),1.0);

}