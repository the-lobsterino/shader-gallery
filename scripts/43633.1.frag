#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const int layers = 3;
const float speed = 0.08;

float noise(float x) {
	return cos(x + cos(x * 1.1415) * 2.1415) * 0.5 + 0.5;
}

void main( void ) {

	vec2 position = (gl_FragCoord.xy - resolution / 2.) / resolution.x;
	position.x += time * speed;
	
	float c = 0.;
	float k = 1.;
	
	for (int j = 0; j < layers; j++)
	{
		float h = 0.;
		float p = 1.;
		for (int i = 0; i < 8; i++)
		{
			p += sin(position.x * 0.0003) + 1.5;
			h += 0.4 * noise(position.x*p) - 0.3 - position.y;
		}
		c = sign(h)*k;
		if (c > 0.) break;
		k -= 1. / float(layers);
		position.x -= time * speed / float(layers);
		position.y -= 0.3 / float(layers);
	}
	
	gl_FragColor = vec4(c,c,c, 1.);

}