#ifdef GL_ES
precision mediump float;
#endif

//really nice

varying vec2 surfacePosition;
uniform float time;

#define maxiter 65
#define m1 1.0
#define m2 0.9
//#define x1 0.045
//#define y1 0.04
//#define x2 -0.05
//#define y2 -0.025
#define r1 1.0
#define r2 0.5
#define v1 0.5
#define v2 0.9

void main( void )
{
	vec2 z = vec2(0.0, 0.0);
	float p = 0.0;
	vec3 fc = vec3(0.0);
	float x1 = sin(time*v1)*r1;
	float y1 = cos(time*v1)*r1;
	float x2 = sin(time*v2)*r2;
	float y2 = cos(time*v2)*r2;
	for (int i=0; i<maxiter; ++i)
	{
		z *= 2.0;
		z = vec2(z.x*z.x-z.y*z.y, z.x*z.y*2.0) + surfacePosition;
		p = m1/sqrt((z.x-x1)*(z.x-x1)+(z.y-y1)*(z.y-y1))+m2/sqrt((z.x-x2)*(z.x-x2)+(z.y-y2)*(z.y-y2));
		p *= 0.09;
		p -= 0.4;
		p = min(max(0.0, p), 1.0);
		float ang = float(i) * 0.5 + time * 0.3;
		vec3 col = vec3(sin(ang-2.0)+0.5, sin(ang)+0.5, sin(ang+2.0)+0.5);
		fc = (fc*(1.0-p)) + (col*p);
		//if (p>0.9) {fc = col;}
	}
	gl_FragColor.rgb = fc;
	gl_FragColor.a = 1.0;
	//gl_FragColor = mix(vec4(0.,1.,0.,0.),vec4(0.08,0.,0.1,0.),vec4(0.0013/pow(dist,1.7), .01/dist, 0.0001/(dist*dist), 1.0));
}