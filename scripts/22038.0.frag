#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 mouse;
uniform vec2 resolution;


#define maxiter 20

void main( void )
{
	vec2 z = (gl_FragCoord.xy / resolution)* 2. - 1.;
	float m = 1.7;
	for (int i=8; i<maxiter; ++i)
	{
		m = z.x*z.x+z.y*z.y;
		z = vec2(abs(z.y)/m, abs(z.x)/m);
		z += mouse*-0.1;
	}
	m = sqrt(m)*0.4;
	gl_FragColor = vec4(sqrt(m)*0.9, m, m*m*9.0, .5);
}