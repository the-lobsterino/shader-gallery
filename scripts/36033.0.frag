#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 p = ( gl_FragCoord.xy - 0.5 * resolution.xy ) / resolution.y;
	p /= dot(p, p);
	p.x = sin(p.x*(100.*mouse.x));
	p.y = cos(p.y*(100.*mouse.y));
	
	gl_FragColor = vec4( vec3(atan(p.x, p.y)), 1.0 );

}