#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	vec2 position = ( gl_FragCoord.xy / resolution.xy );
	
	if( fract(position.x) >= 0.7 + cos(time)*0.1 || fract(position.y) <= 0.2 + cos(time)*0.1 )
		gl_FragColor = vec4(0,0,0,1);
	else
		gl_FragColor = vec4(1,1,1,1);
}