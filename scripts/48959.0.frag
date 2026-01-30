#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = gl_FragCoord.xy / resolution.xy;

	float color = 0.0;
	color += exp(sin( distance(vec2(sin(time), tan(time)), vec2(position.x + cos( time / 15. )) ) + cos( position.y * cos( time / 15.0 ) * 10. )));
	gl_FragColor = vec4( color * vec3( sin(color * time), sin(color + time + 2.), color * sin( time + 4. )), 1.0 );

}