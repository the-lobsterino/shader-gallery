#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;



//Fades from colorA to colorB in the span of 5 minutes
void main( void ) {
	
	
	vec3 colorA = vec3(1.0,0.00,0.00);
	vec3 colorB = vec3(0.002,.99,0.4);
	
	float mins_5 = 60.0*5.0;
	
	vec3 colorNow = mix(colorA,colorB,time/mins_5);

	gl_FragColor = vec4(colorNow, 1.0 );

}