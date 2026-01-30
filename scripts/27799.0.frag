#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = gl_FragColor.xy;

	vec4 color = vec4(0, 0, 0, 0);
	
	if (mod(position.x, 10.0) <= 1.0)
	{
		color.r = 1.0;
	}
	if (mod(position.y, 10.0) <= 1.0)
	{
		color.r = 1.0;
	}
	gl_FragColor = color;

}