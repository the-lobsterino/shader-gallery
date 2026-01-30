#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy );

	float color = 0.0;
	if (gl_FragCoord.x > resolution.x/3.)
	if (gl_FragCoord.x < resolution.x*2./3.)
	if (gl_FragCoord.y > resolution.y/4.)
	if (gl_FragCoord.y < resolution.y*3./4.)
		color += sin( position.x*(200.+sin((time/4.-gl_FragCoord.y/1000.)*3.)*400.));

	gl_FragColor = vec4( vec3( (-max(color, 0.3)*sin(time*50.+gl_FragCoord.y/400.))/6.+0.6, min(0.3+color, 1.3), min(0.3+color, 1.3) ), 1.0 );

}