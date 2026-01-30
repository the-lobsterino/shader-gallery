#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 coords = 6. * ( gl_FragCoord.xy / resolution.xy );
	
	for( int n = 1; n < 8; n++ ) {
		float i = float(n);
		coords += vec2(0.7 / i*sin(i*coords.y+time+0.3*i) + 0.8, 0.4 / i*sin(i*coords.x+time+0.3*i) + 1.6);
	}

	vec3 color = vec3( 0.5*sin(coords.x)+0.5, 0.5*sin(coords.y)+0.5, sin(coords.x + coords.y));

	gl_FragColor = vec4( color, 1.0 );
	

}