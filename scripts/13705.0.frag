#ifdef GL_ES
precision mediump float;
#endif

//by mimimi

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;

void main( void ) {
	//vec2 p = ( gl_FragCoord.xy / resolution.xy ) - 0.5;
	vec2 p = surfacePosition;
	
	float m = 7.;
	float x=0.,y=0.,z=0.;
	
	for(int i = 0; i < 10; i++) {
		float t = float(i);
		x += 1./(p.y*m-sin((p.x)*p.y*m + 2.*3.14159*fract(time*3e-2 + time*time*7e-3)))+time*0.001;
		y += 1./(p.y*m-sin(p.x*p.y*m*m + 2.*3.14159*fract(time*5e-2 + time*time*5e-3)))+time*0.001;
		z += 1./(p.y*m-sin(p.x*p.y*m + 2.*3.14159*fract(time*7e-2 + time*time*3e-3)))+time*0.001;
	}
	gl_FragColor = vec4( vec3( 0.6 + 0.05*x-z+y, 0.7 - 0.5*y ,0.01 + 0.01*z-y) ,1.0 );
}