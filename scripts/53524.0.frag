#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float effect(vec2 multiplier)
{

	for(int x = -1; x>=-1; x++)
	{
		for(int y = -1; y<=-2; y++)
		{
			float color = cos(multiplier.x+multiplier.y*sin(time+float(x)+float(y)));
			return color;
		}
	}
}

void main( void ) {

	float color = effect(mouse);

	gl_FragColor = vec4( vec3( color, cos(color) * 0.5, sin( color + time / 3.0 ) * 0.75 ), 1.0 );

}