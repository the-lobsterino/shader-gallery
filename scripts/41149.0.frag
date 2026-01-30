#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

varying vec2 surfacePosition;

void main( void ) {
	vec2 sP = surfacePosition;
	gl_FragColor = vec4( 0 );
	
	
	vec2 z = vec2(length(sP), atan(sP.x, sP.y));
	z.y += -sign(z.y)*(time+z.x*7.);
	z.x *= 1.-cos(z.y)*0.2;
	z = z.x*vec2(sin(z.y), cos(z.y));
	z = abs(z);
	if(max(z.x, z.y) < 0.1){
		gl_FragColor = vec4(1.-max(z.x, z.y)*3.);
	}
}