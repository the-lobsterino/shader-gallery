#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
float fieldSize = cos(time)*0.1;

void main( void ) {

	vec2 position = gl_FragCoord.xy / resolution.xy;
	float pxFieldSize = resolution.x * fieldSize;

	if(mod(gl_FragCoord.x, pxFieldSize*2.0) < pxFieldSize ^^ mod(resolution.y-gl_FragCoord.y, pxFieldSize*2.0) < pxFieldSize)
	{
		gl_FragColor = vec4( sign(time), tan(time), 0.0, 0.0 );
	}
	else
	{
		gl_FragColor = vec4( 0.0, floor(time), sin(time), 1.0 );
	}

}