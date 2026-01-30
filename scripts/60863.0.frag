#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 st = ( gl_FragCoord.xy / resolution.xy ) + mouse / 4.0;

	float color = mod(st.x + st.y, 0.2) +abs( sin(time));
	color = length(st) * color;

	gl_FragColor = vec4( vec3(color), 1.0 );

}