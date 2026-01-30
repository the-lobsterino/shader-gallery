#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
float zoom = 0.01;

void main( void ) {

	vec2 p = ( gl_FragCoord.xy / resolution.xy ) / 4.0;
	p = resolution.xy / min( resolution.x, resolution.y ) * ( p+ vec2( -0.125, -0.125 ) ) / zoom;
	
	float py = p.y+pow(abs(p.x/(sin(time)*2.0+3.0)),tan(time)+3.)-50.;

	float theta = floor(sin(   py  + 20.0 * sqrt(  5.- py     ) - time * 4.0 ) / 2. - .1) ;
	float r = .258+theta;
	float g = 0.01+theta;
	float b = .12+theta;
	 
	
	if (py>1.0) {
		gl_FragColor = vec4( .258, 0.01, .12, 1.0 );
	} else {
		gl_FragColor = vec4( r, g, b, 1.0 );
	}
}