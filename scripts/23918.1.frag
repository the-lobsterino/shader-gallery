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
	float r = sin(time * 2.0);
	center.x = cos(time * 10.0) ;
	center.y = sin(time * 10.0) ;
	
        float color = distance (position, center);
	color = step(cos(time*2.0), color);

	
        gl_FragColor = vec4(0.5 , sin(time*1.0) , color, 1.0 );
	
	
	





}