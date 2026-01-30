#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 diff=gl_FragCoord.xy - resolution*0.5;
	
	float theta=atan(diff.y,diff.x);
	float factor;

	float factorx=10.0*(sin(gl_FragCoord.y/9.0 - time*5.0)*0.5 + 1.0);
	float factory=10.0*(cos(gl_FragCoord.x/9.0 - time*5.0)*0.5 + 1.0);
	
	float color = gl_FragCoord.y-factorx * 5.+gl_FragCoord.x-factory * 25.;
	
	float cy=gl_FragCoord.y-factory;
	float cx=gl_FragCoord.x-factorx;
	
	float len=distance(0.5*resolution,vec2(cx,cy));
	if(len<50.0){gl_FragColor=vec4(0.4 - color * 0.00001,0.9 + color * 0.002,0.8 - color * 0.001,1.0);}
}