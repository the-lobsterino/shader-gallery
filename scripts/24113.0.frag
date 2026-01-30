precision mediump float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution );
	float aspect_ratio = resolution.x / resolution.y; 
	
	position = position *sin(time);
	position.x = position.x * aspect_ratio ;
	
	vec2 center = vec2(0.0,0.0);
	float r = sin(time * 2.0) ;
	center.x = cos(time * 1.0 );
	center.y = sin(time* 1.0);
	float color = distance(position, center*0.3);
	color = 1.0- step  (0.1, color );
	
	gl_FragColor = vec4( color, cos(time) , 1.0 , 0.5 );
}