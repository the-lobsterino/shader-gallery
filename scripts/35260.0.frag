#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy ) + mouse / 1.0;

	vec3 color = vec3(sin(position.y*2105748.+time), sin(position.y*0.7), sin(position.y*56743.9));

	gl_FragColor = vec4( vec3( color), 1.0 );

}