// drown // 3/24/17 //
	
#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define time time+sin(gl_FragCoord.x/100.)*sin(gl_FragCoord.y/25.)

void main( void ) {

	vec2 position = tan( gl_FragCoord.xy / resolution.xy);

	float color = 0.0;
	if (gl_FragCoord.x > resolution.x/3.+sin(time)*30.)
	if (gl_FragCoord.x < resolution.x*2./3.+sin(time)*40.)
	if (gl_FragCoord.y > resolution.y/4.+sin(time)*20.)
	if (gl_FragCoord.y < resolution.y*3./4.+sin(time)*50.)
		color += length(sin(((time+position.x*30.))-(sin(time+position.y*20.))*sin(time*0.8+gl_FragCoord.y/300.)*2.));
	if (gl_FragCoord.x > resolution.x/3.+sin(time)*30.)
	if (gl_FragCoord.x < resolution.x*2./3.+sin(time)*40.)
	if (gl_FragCoord.y > resolution.y/4.+sin(time)*20.)
	if (gl_FragCoord.y < resolution.y*3./4.+sin(time)*50.)
		color *= length(sin(((time+position.y*20.))-(sin(time*.7+position.x*10.))*sin(time*0.9+gl_FragCoord.y/400.)*1.));

	gl_FragColor = floor(vec4( vec3( -0.6, min(0.3+color, 1.3)/3., 0.2+color/6. ), 1.0 )*16.)/16.;

}