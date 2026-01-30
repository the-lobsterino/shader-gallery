#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution; //ekrāna izmērs

void main( void ) {

	vec2 position = (gl_FragCoord.xy/resolution.xy) -0.5 ;
	float y = 0.2  * position.y * sin(100.0*position.y-20.0*time*0.35);
	float krasa = 1.0 / (500. * abs(position.x - y));
	krasa += 1./(665.*length(position - vec2(0., position.y)));
	float saule = 1./(65.*length(position - vec2(0, 0)));
	gl_FragColor = vec4( position.y * 0.5 - krasa   * saule,  krasa * saule,  krasa*5. * saule, 1.0); //iekrāso pelēcīgu

}