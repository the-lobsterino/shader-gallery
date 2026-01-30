// C R O S S F I R E

#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy );

	float color = 0.5;
	if(gl_FragCoord.x>=mod(resolution.x/2.+(time*8.6*resolution.x/10.), resolution.x)) color += 1.0;
	if(gl_FragCoord.x>=resolution.x-mod(resolution.x/2.+(time*7.9*resolution.x/5.), resolution.x)) color -= 1.0;
	if(gl_FragCoord.y>=mod(resolution.y/2.+(time*13.4*resolution.y/8.), resolution.y)) color += 1.0;
	if(gl_FragCoord.y>=resolution.y-mod(resolution.y/2.+(time*6.*resolution.y/7.), resolution.y)) color -= 1.0;
	color = mod(color, tan(time*8.));

	gl_FragColor = vec4( vec3( 0., color-1., 0. ), 1.0 );

}