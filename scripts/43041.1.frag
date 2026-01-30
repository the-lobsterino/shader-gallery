#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 pos = ((gl_FragCoord.xy / resolution) - 0.5) * 2.;
	float aspect = resolution.x / resolution.y;
	if (aspect > 1.) pos.x *= aspect;
	else pos.y /= aspect;
	float r = length(pos) ;
	if (r < 1.)
	{
		r *= sin(time * .75) * .5 + 3.;
		float b = r;
		if (b > 1.) b = 1.;
		b = 1. - b;
		gl_FragColor = mix(vec4(0,b * .5,b,1),vec4(1,.5,0,1),r * .5);;
	}
	else gl_FragColor = mix(vec4(1,1,1,1),vec4(0,0,0,0),r - 1.);
		

	/*float color = 0.0;
	color += sin( position.x * cos( time / 15.0 ) * 80.0 ) + cos( position.y * cos( time / 15.0 ) * 10.0 );
	color += sin( position.y * sin( time / 10.0 ) * 40.0 ) + cos( position.x * sin( time / 25.0 ) * 40.0 );
	color += sin( position.x * sin( time / 5.0 ) * 10.0 ) + sin( position.y * sin( time / 35.0 ) * 80.0 );
	color *= sin( time / 10.0 ) * 0.5;

	gl_FragColor = vec4( vec3( color, color * 0.5, sin( color + time / 3.0 ) * 0.75 ), 1.0 );*/

}