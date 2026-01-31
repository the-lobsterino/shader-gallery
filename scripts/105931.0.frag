#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {


	
	vec2 m = mouse * resolution;
	if(length(gl_FragCoord.xy - m.xy) <= 60.0){
		float t1 = cos(gl_FragCoord.x) * 2.0;
		float t2 = sin(gl_FragCoord.y) * 1.0;
		gl_FragColor = vec4(t2  ,0.0,t1,1);
	}
	else{
		float t1 = cos(gl_FragCoord.x);
		gl_FragColor = vec4(t1,t1,t1,255);
	}
}