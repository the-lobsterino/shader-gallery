#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable
// simple water perspective

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.x ) + 1.0 / 8.0;

	float color = 0.4;
	
	color += 0.1*cos( (position.y+position.x-0.7)/(1.1-position.y) * 2.0 * (25.0+0.1*cos(time*3.3))       );
	color += 0.2*sin( (position.x-0.5)/(1.15-position.y)  * 7.0 * (25.0+0.1*sin(time*3.0))  );
	color += 0.2*sin(  20.0/(1.2-position.y) * 7.0+time*2.0);
	

	gl_FragColor = vec4( vec3( 0.0+color*0.01, 0.5+color * 0.05, 1.0 ), 9.0 );
}