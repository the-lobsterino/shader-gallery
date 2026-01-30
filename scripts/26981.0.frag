#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;

void main(void)
{
	vec2 position = surfacePosition * 30.0;
	float t = time * 0.1;
	float color = 0.0;
	for (int i = 0; i < 44; ++i)
	{
		float t = 1.0 - time*0.1;
		float tri1 = sin(position.x);
		float tri2 = position.x;
		color += 1.0/distance(position,vec2(tri2,tri1));
		break;
	}
	gl_FragColor = vec4(color * vec3(.3, 0.2, 0.), 2.0);
//wip
}