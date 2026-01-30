// more fanny batter (deep computed)
#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec3 palette( float t ) {
    vec3 a = vec3(2.5, .5, 0.5);
    vec3 b = vec3(1.5, 0.5, 0.5);
    vec3 c = vec3(1.0, 1.0, 1.0);
    vec3 d = vec3(0.263,0.416,0.557);

    return a + b*cos( 6.28318*(c*t+d) );
}

void main( void ) {
	
	float t = time*230.1;
	float t2 = time*5.0;

	
	vec2 position = ( gl_FragCoord.xy / resolution.xy) - .5;
	position.x += sin(time+position.x*1.0)*1.05;
	position.x *= resolution.x/resolution.y;
	position *= 1.75;
	position.y *= dot(position,position);
	
	position.y *= 1.0+sin(position.x*5.40+t2)*0.2;
	
	float foff = 2.33;
	float den = .07;
	float amp = .2;
	float freq = mouse.x*5. + 3.;
	float offset = 0.3-sin(position.x*0.5)*0.05;


	vec3 colour = vec3 (1.11, 0.22, 0.11) * 
		 ((1.0 / abs((position.y + (amp * sin(((position.x*4.0 + t) + offset) *freq)))) * den)
		+ (1.0 / abs((position.y + (amp * sin(((position.x*4.0 + t) + offset) *freq+foff)))) * den)
		+ (1.0 / abs((position.y + (amp * sin(((position.x*4.0 + t) + offset) *freq-foff)))) * den));
	#define col colour
	
	col = 1. - exp( -col*mouse.y*6. );  // some cheap tonemapping
	col = palette( cos( col.y/1.5 + 1.42 ) );
	gl_FragColor = vec4( colour, 2.0 );

}