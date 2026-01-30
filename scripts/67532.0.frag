// N100920N Fraktal Art - Chaos vs Order
precision highp float;
uniform float time;
varying vec2 surfacePosition;



#define MAX 100.0

void main()
{
	vec2 p = 2.0*surfacePosition;
	// p /= dot(p,p);
		
	vec3 l = vec3(0.);
	for (float f=1.0; f<MAX; f+=1.)
	{
		p += vec2(sin(p.x), cos(p.y)) * l.xy*sin(time);
		p*=sin(p.x)+2.5;
	       	l.r += (f-p.y);
		l.g += (f+p.x);
		l.b += (f+p.y);
	}
	l /= MAX;	
	gl_FragColor = vec4(1.- l, 1.);
}