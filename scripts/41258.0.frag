#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
varying vec2 surfacePosition;

void main( void ) {
	vec2 sP = surfacePosition;
		
	vec2 z = vec2(length(sP)*3.5, atan(sP.x, sP.y));
	z.y += time*3.5+z.x*14.0;
	z.x *= 1.-sin(z.y)*0.1;
	z = abs(z.x*vec2(cos(z.y), cos(z.y)));
	gl_FragColor = vec4(1.0-max(z.x, z.y)*5.);
	
}