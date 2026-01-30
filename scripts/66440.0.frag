// 310720N

// gig@tron France
#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 p =  ( gl_FragCoord.xy / resolution.xy )  -.5;
	 
	vec2 v2=vec2(length(2.0*p*sin(p+time*0.5))*4.0);
	vec3 nr=normalize(vec3(v2, .5-sin(p/time)));
	gl_FragColor = vec4(nr * cos(nr.z*time) - (10.*p.y*nr.z+nr.x*sin(nr.x+time*nr.z)), .0);

}