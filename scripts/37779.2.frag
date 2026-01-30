#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;

void main( void ) {

	vec2 p = surfacePosition;
	float zagi, zigi, backg;
	float color = 1.0;
	float t = time/.5;
	
	if (p.y > -0.5) backg = sign(mod(p.x,0.3)-0.29)+0.51+0.3*abs(p.y)-p.y/.5;
		
	for (float i=0.0; i<0.1; i+=0.01){
		t+= i*.59;
		zagi+= step(length(p-vec2(0.7*sin(t/2.0),
		       -0.5+0.35*abs(sin(t*2.10)+.1*cos(time/10.0)))),i*0.05);
		};
	
	for (float i=0.00; i<0.1; i+=0.01){
		t-= i*-.9;
		zigi+= step(length(p-vec2(0.7*sin(t/2.0),
		       0.30+0.05*abs(sin(t*8.10)))),0.0021+i*0.075);
		};
	
		
		gl_FragColor = vec4( vec3(mix( vec3(zigi,0,0) , vec3(0,0,zagi), .85)) +
				     vec3(mix( vec3(backg,0,0), vec3(-0.1), 1.5)), 1.0);
 }