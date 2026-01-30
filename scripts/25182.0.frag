#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 p = ( gl_FragCoord.xy/ resolution.xy );
	p = p * 2.0 - 1.0;
	p.x = p.x * resolution.x/ resolution.y;

	float d = 20. * p.x / (2. * 3.14) - 0.25;
	d =  mod(d, 1.);
	d = 4. * d - 2.;
	d = abs(d);
	d = d + sin(time);
	
	
	float color = d;
	
gl_FragColor = vec4( vec3( color ), 1.0 );

}