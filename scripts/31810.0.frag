// M A L F U N C T I O N A L

#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define time floor(floor(time*2.)*(gl_FragCoord.x/800.+length(gl_FragCoord.y*sin(floor(cos(gl_FragCoord.y/(floor(time*7.)*0.1+gl_FragCoord.y*tan(time+sin(floor(time*3.)+floor(gl_FragCoord.x*900.))))*0.6)*4./3.)*2.)/100.))*100.)
#define G vec2(12.+floor(sin(time*14037.)*2.)*(sin(time)+3.))/10.
#define gl_FragCoord (gl_FragCoord.xy-mod(gl_FragCoord.xy, G))

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy );

	float color = 0.0;
	color += floor(sin( position.x * cos( time / 1220.0 ) * 2.0 ) + cos( position.y * cos( time / 2000.0 ) * 4.0 )*1.99);

	float colorb = 0.0;
	colorb += floor(sin( position.x * cos( time / 610.0 ) * 1.0 ) + cos( position.y * cos( time / 1000.0 ) * 5.0 )*1.99);

	float colorc = 0.0;
	colorc += floor(sin( position.x * cos( time / 320.0 ) * 2.0 ) + cos( position.y * cos( time / 500.0 ) * 6.0 )*1.99);

	gl_FragColor = vec4( vec3( ((colorb+colorc)-color)*(sin(time*1337.)+3.)*0.05, (color+colorb)-colorc, 0. ), 1.0 );

}