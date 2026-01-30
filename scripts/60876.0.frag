#ifdef GL_ES
precision mediump float;
#endif


uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy - 0.5*resolution.xy) / resolution.xy  * 200.0*mouse.x;
	float t = time;
	float x = position.x;
	float y = position.y;

	float color = x;
	float r = x;
	float g = y;
	float b = color;
	
	gl_FragColor = vec4( r, g, b, 1.0 );

}