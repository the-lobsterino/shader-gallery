#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float r, g, b;
float col;

float PI = 3.14;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy );
	vec2 center = vec2(0.5, 0.5);
	
	float ts = sin(time);
	
	col = abs(sin(position.x - 0.5) / sin(position.y - 0.5) / 2.);

	col += sin(time + distance(center, position)); 
	
	
	gl_FragColor = vec4(col * 1.0, col * 2.0, col * 1.5, 1.0);

}