#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D key;
void main( void ) {
	vec2 position = ( gl_FragCoord.xy / resolution.xy );
	vec3 color = vec3(
		sin(.04 *time * log(time) /time*time ) *.4 + cos(length(position.x)*cos(time))*0.5,
		cos(.04 *time * log(time) /time*time)*.2 + sin(length(position.y)*sin(time))*0.3 -fract(time)*0.2*sin(time),
		sin(.1 *tan(length(position)) * log(time)/sin(.3 *time))*.4
		);
	gl_FragColor = vec4( color, 1.0 );

}