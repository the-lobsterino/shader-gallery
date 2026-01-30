#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy ) + mouse / 4.0;

	float r = sin( time + 0.0 + position.x ) * 0.5 + 0.5;
	float g = sin( time + 1.0 + position.y ) * 0.5 + 0.5;
	float b = sin( time + 2.0  + position.x) * 0.5 + 0.5;
	
	
	gl_FragColor = vec4(r,g,b,1.0);

}