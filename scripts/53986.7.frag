#ifdef GL_ES
precision highp float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec4 color;
	bool yCondition = false;
	bool xCondition = false;
	yCondition = (gl_FragCoord.y  > sin(gl_FragCoord.x) + (resolution.y / 2.0) - 1.5 ) &&  (gl_FragCoord.y  < sin(gl_FragCoord.x) + (resolution.y / 2.0) ) ;
	float timeInt = time* 29.0;
	xCondition = gl_FragCoord.x > timeInt - 15.0 && gl_FragCoord.x < timeInt + 15.0 ;
	if( xCondition && yCondition) {
		color = vec4(0.3 + sin(time), 0.0, 0.0 + cos(time), 1.0);
	}
	else {
		color = vec4(0.0, .5, 0.0, 1.0);	
	}
	gl_FragColor = color;

}