#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	vec2 position = ( gl_FragCoord.xy / resolution ) ;
	float aspect_ratio = resolution.x/ resolution.y;
		
	position = position * 2.0 - 1.0;
	position.x = position.x*aspect_ratio;
	
	
	vec2 center = vec2(0.0,0.0);
	float r = sin(time * 0.0);
	center.x = cos(time * 50.0) ;
	center.y = sin(time * 100.0) ;
	
	float a = sin(3.14 * 100.0 * position.x + 10.0 * time);
	float b = sin(3.14 * 10.0 * position.y + 10.0 * time);
	
	float x = tan(10.0 * position.y + 100.0 * time);
	
        float color = distance (center, vec2(x,position));
	
	color = step(0.1, color);
	
	
        gl_FragColor = vec4(a+b+sin(time), 0.2 , color, 1.0 );
	
	
	




}