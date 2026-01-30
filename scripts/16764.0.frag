#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 pos = ( gl_FragCoord.xy / resolution.xy );
	vec2 position = vec2(0.0, 0.0);
	float theta = 0.2 * time;

	position.x = pos.x * cos(theta) + pos.y * sin(theta);
	position.y = pos.x * cos(theta) - pos.y * sin(theta);
		
	float r = 0.0;
	float g = 0.0;
	float b = 0.0;
	
	r += sin(15.0 * (position.x + time));
	g += cos(16.0 * (position.y + time));
	b += cos(17.0 * (position.y + time));
	
	gl_FragColor = vec4( vec3( r  + tan(time/position.x), g + tan(time/position.x), b + tan((0.1*time)/position.x)), 1.0 );
}