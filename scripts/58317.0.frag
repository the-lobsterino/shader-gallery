#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 p = ( gl_FragCoord.xy / resolution.xy);

	vec3 color = vec3( 0.2, 0.4, 1.0 );
	float y = (p.y > 0.25 && p.y < 0.75) ? p.y : sin(time);
	
	vec3 colorF = color * y;

	gl_FragColor = vec4( colorF, 1.0 );

}