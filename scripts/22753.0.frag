#ifdef GL_ES
precision mediump float;
#endif

varying vec2 surfacePosition;

#define maxiter 1100

void main( void )
{
	vec2 z = vec2(0.0, 0.0);
	float p = 0.0;
	float dist = 1e20;
	float diter = 0.0;
	float iter = 0.0;
	for (int i=0; i<maxiter; ++i)
	{
		z = vec2(z.x*z.x-z.y*z.y, z.x*z.y*2.0) + surfacePosition;
		p = z.x*z.x + z.y*z.y;
		iter = float(i);
		if (p < dist)
		{
			dist = p;
			diter = iter;
		}
		if (p > 4.0) break;
	}
	dist = dist*8.0;
	//diter /= float(maxiter-1);
	iter /= float(maxiter-1);
	if (iter == 1.0) iter = 0.0;
	//gl_FragColor = vec4(sin(diter*200.0)*0.5+0.5, cos(diter*321.0)*0.5+0.5, sin(diter*20.0)*0.5+0.5, 1.0);
	gl_FragColor = vec4(sin(diter*200.0)*0.5+0.5, cos(diter*321.0)*0.5+0.5+dist, sin(diter*20.0)*0.5+iter, 1.0);
	//gl_FragColor = vec4(dist/1.1, dist*dist/0.8, dist*dist*dist/0.9, 1.0);
}