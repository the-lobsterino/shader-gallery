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
	vec3 col = vec3(0.1,0.3,0.5*p.y);
	float d = length(p);
	
	float a = atan(p.x,p.y)+.0*(p.y/p.x);
	float s =0.2+ 0.41*sin(a*15.0-time*2.0);
	float r = .55+.575*pow(s,1.0);
	
	float f = (d>r)?0.0:1.0;
	p*=rot(time/12.0);
	float t = mod(p.y+p.x,r-1.1);
	vec3 color = vec3(0.0,0.0,0.75*p.y+mod(r,0.9));
	
	gl_FragColor = vec4( vec3(mix(t+ col,color, f )), 1.0 );

}















