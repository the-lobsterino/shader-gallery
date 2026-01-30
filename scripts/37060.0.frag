#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 pos = (gl_FragCoord.xy / resolution) * 2. - 1.;
	
	float a = 0.;
	float zoom = 1000.*mouse.x;
	float speed = 2.;
	
	const int N = 7;
	float f = 3.1415927 / float(N);
	
	for (int i = 0; i < N; i++)
	{
		float t = f * float(i);
		float p = cos(t) * pos.x + sin(t) * pos.y;
		a += sin(p * zoom + time * speed);
	}

	gl_FragColor = vec4(a*length(pos), a, a, 1.0);
}