#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


void main( void ) {


	vec2 uv = (gl_FragCoord.xy - .5 * resolution.xy)/resolution.y;
	
	// float color = length(mouse - uv);
	float c1 = pow(sin(4.*time), 1.0) * uv.x + pow(cos(1.*time), 3.) * uv.y;
	float c2 = pow(sin(3.*time), 2.0) * uv.x + pow(cos(2.*time), 2.) * uv.y;
	float c3 = pow(sin(2.*time), 3.0) * uv.x + pow(cos(3.*time), 1.) * uv.y;
	float a  = pow(sin(1.*time), 1.0) * uv.x + pow(cos(4.*time), 1.) * uv.y;
	
	c1 = smoothstep(0.0, 0.1, c1);	
	/* 
	
	c2 = smoothstep(0.0, 0.1, c2);	
	c3 = smoothstep(0.0, 0.1, c3);	
	*/

	gl_FragColor = vec4( c1, c2, c3, a );

}