#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy );

	float color = 0.1;
	
	if ( mod(gl_FragCoord.x + (time * 50.), 30.) < 1.)
	{
		color += 0.4;
	}
	
	if ( mod(gl_FragCoord.y + (time * 50.), 30.) < 1.)
	{
		color += 0.4;
	}
	
	gl_FragColor = vec4(color);

}