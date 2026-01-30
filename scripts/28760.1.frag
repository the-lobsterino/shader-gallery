#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;

float f(float arg) {
	return sin(arg * 20.0 + time * 0.5) * 0.05 + sin(arg * 25.0 + time) * 0.1 + sin(arg * 10.0 - time) * 0.2;		
}
 
void main( void ) {
	
	vec2 position = ( gl_FragCoord.xy / resolution.xy ); 
	position.x *= resolution.x/resolution.y; 
	position.y -= 0.5;
	
	vec3 color;
	color = vec3(1.0) - abs((f(position.x * 1.5) - position.y) / 0.01);
	
	gl_FragColor = vec4(color, 1.0 );
}
