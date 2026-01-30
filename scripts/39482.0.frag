#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define time time*2.-gl_FragCoord.y/100.+sin(gl_FragCoord.x/50.+time*4.)

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy ) + mouse / 4.0;

	float color = 0.0;
	if (gl_FragCoord.x > resolution.x / 7. + gl_FragCoord.y/3.+cos(time+gl_FragCoord.y/500.)*100.) color += 1.;
	if (gl_FragCoord.x > resolution.x / 3.3 + gl_FragCoord.y/3.+cos(time+gl_FragCoord.y/300.)*100.) color -= 1.;
	if (gl_FragCoord.x-300. > resolution.x / 7. - gl_FragCoord.y/3.+sin(time+gl_FragCoord.y/400.)*100.) color += 1.;
	if (gl_FragCoord.x-300. > resolution.x / 4.5 - gl_FragCoord.y/3.+sin(time+gl_FragCoord.y/200.)*100.) color -= 1.;

	float colorb = 0.0;
	if (gl_FragCoord.x-10. > resolution.x / 7. + gl_FragCoord.y/3.+cos(time+gl_FragCoord.y/500.)*100.) colorb += 1.;
	if (gl_FragCoord.x-10. > resolution.x / 4.2 + gl_FragCoord.y/3.+cos(time+gl_FragCoord.y/300.)*100.) colorb -= 1.;
	if (gl_FragCoord.x-310. > resolution.x / 7. - gl_FragCoord.y/3.+sin(time+gl_FragCoord.y/400.)*100.) colorb += 1.;
	if (gl_FragCoord.x-310. > resolution.x / 4.7 - gl_FragCoord.y/3.+sin(time+gl_FragCoord.y/200.)*100.) colorb -= 1.;
	
	float colorc = 0.0;
	if (gl_FragCoord.x-5. > resolution.x / 7. + gl_FragCoord.y/3.+cos(time+gl_FragCoord.y/500.)*100.) colorc += 1.;
	if (gl_FragCoord.x-5. > resolution.x / 5.2 + gl_FragCoord.y/3.+cos(time+gl_FragCoord.y/300.)*100.) colorc -= 1.;
	if (gl_FragCoord.x-305. > resolution.x / 7. - gl_FragCoord.y/3.+sin(time+gl_FragCoord.y/400.)*100.) colorc += 1.;
	if (gl_FragCoord.x-305. > resolution.x / 3.6 - gl_FragCoord.y/3.+sin(time+gl_FragCoord.y/200.)*100.) colorc -= 1.;
	
	float colord = color+colorb+colorc+sin(time+gl_FragCoord.y/100.)*3.;

	gl_FragColor = vec4( floor(vec3( color-colorc-1., colorb-color-1., colorc-colorb-1. )/1.1)*8./colord/20.*gl_FragCoord.y/500., 1.0 );

}