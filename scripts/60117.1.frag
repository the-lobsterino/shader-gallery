// more fanny batter (deep computed)
#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	
	float t = time*0.1;
	float t2 = time*4.0;

	
	vec2 position = ( gl_FragCoord.xy / resolution.xy ) - 0.5;
	position.x = dot(position,position)*4.0;
	position.x *= resolution.x/resolution.y;
	position *= 0.25+sin(time)*0.1;
	
	position.y *= 4.+sin((position.y*position.x)*15.40+t2)*.15;
	
	float foff = sin(time*.5)*0.75;
	float den = 0.1;
	float amp = .1;
	float freq = 16.;
	float offset = 0.2-sin(position.x*0.5)*0.05;


	vec3 colour = vec3 (.3, 0.55, 2.1) * 
		 ((1.0 / abs((position.y + (amp * sin(((position.x*4.0 + t) + offset) *freq)))) * den)
		+ (1.0 / abs((position.y + (amp * sin(((position.x*4.0 + t) + offset) *freq+foff)))) * den)
		+ (1.0 / abs((position.y + (amp * sin(((position.x*4.0 + t) + offset) *freq-foff)))) * den));


	float dd = (1.0 / abs((position.y + (amp * sin(((position.y*32.0 + t) + offset) *freq+foff)))) * den);
	colour *= vec3(.25,0.41,.29)*dd;
	
	
	gl_FragColor = vec4( colour, 1.0 );

}