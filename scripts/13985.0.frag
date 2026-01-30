#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float asd(float x)
{
	return x * 100000.0 * max(0.0, 0.01 - x);
}

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.yy );

	float color = 0.0;
	
	for (int i = 0; i < 5; i++)
	{
		color += asd(position.y - 0.7 + float(i) * 0.1);
		color = max(0.0, color);
	}
	gl_FragColor = vec4(vec3(color), 1.0 );

}