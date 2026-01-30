#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 p = ( gl_FragCoord.xy / resolution.xy ) ;

	p += -.5;
	
	float t = abs(fract(time*.1)*2.-1.)+1.5;
	t = t/(t-1.);
 	float time = pow(t,7.);
	float t1 = (p.x+p.x*p.y)*time;
	float t2 = (p.y+p.x*p.y) *time*1.0;
	
	gl_FragColor = vec4( max(cos(vec3(.5,.7,.3 )* t1),cos(vec3(.1,.2,.11 )* t2)  ), 1.0 );

}