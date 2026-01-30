#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {


	vec2 position = gl_FragCoord.xy / resolution.xy;
	float green = ((position.x + sin(time))/ 2.0) - position.y;
	float blue = -(position.y - 0.9);
	
	
	float red = 0.0;
	
	
	red += sin(position.y * cos(-0.5) * 50.0);
	
	if(position.x > 0.5){
		red += tan(((position.x * abs(sin(time / 10.0))) * 50.0));
		
		
		if(position.y > 0.5){
			red = 0.0;
			green = 0.2;
			blue += sin(time/0.3);
		}
	}else {
		red += tan(((position.x * -abs(cos(time / 10.0))) * 50.0));
	}
	
	
	
	gl_FragColor = vec4(red, green, blue, 1.0);
}