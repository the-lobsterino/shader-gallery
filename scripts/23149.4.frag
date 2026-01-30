#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


float my_shader(float x, float y){
    	return sin( sin(x * 10.0) / cos(y * 10.0) + time ) * cos(cos(y * 10.0) / sin(x * 10.0));
}

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy ) + mouse;
	
	position = 2.0 * position - 1.0;
	
	position.x *= (resolution.x / resolution.y);
	
	float color = my_shader(position.x, position.y);

	gl_FragColor = vec4( color, sin(time)*position.x*color , sin(time)*position.x*color, 1.0);


}