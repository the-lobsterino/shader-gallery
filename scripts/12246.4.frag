#ifdef GL_ES
precision mediump float;
#endif

varying vec2 surfacePosition;
uniform float time;
uniform vec2 mouse;

#define maxiter 100

void main( void )
{
	vec2 z = surfacePosition;
	float iter = 0.0;
	for (int i=0; i<maxiter; ++i)
	{
		z = abs(z)/dot(z, z) - mouse; //kaliset
		if (z.x*z.x + z.y*z.y > 8.0)
		{
			iter = float(i);
			break;
		}
	}
	gl_FragColor = vec4(.0, .0, .0, 1.);
	if (iter != 0.0)
	{
		iter /= float(maxiter);
		iter *= 3.;
		gl_FragColor = vec4(sin(vec3(iter, iter+1.05, iter+2.10)), 1.0);
	}
}