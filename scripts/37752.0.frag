#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;

mat2 rot (float angle){
return mat2( cos(angle),-sin(angle),
	     sin(angle), cos(angle));
}
void main( void ) {

	vec2 p = surfacePosition;
	p*=2.00;
	vec3 col = vec3(0.1,0.5,0.5*p.y);
	float d = length(p);
	
	float a = atan(p.x,p.y)+.0*(p.y*p.x);
	float s =0.2+ 0.41*sin(a*15.0-time*2.0);
	float r = .55+.575*pow(s,1.0);
	
	gl_FragColor = vec4(s * a, s, s, 1);
}















