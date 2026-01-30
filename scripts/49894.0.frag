#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 p = ( gl_FragCoord.xy / resolution.xy ) + mouse / 4.0;
	
	float c= abs(p.x-sin(time)*0.05);
	float d= abs(p.y+cos(time*p.x)*0.05)*0.05*sin(time+cos(p.x));
	
	float color = 1.0;
	 

	gl_FragColor = vec4( vec3( cos(time*c), cos(time*d), sin( color + time / 3.0 ) * 0.75 ), 1.0 );

}