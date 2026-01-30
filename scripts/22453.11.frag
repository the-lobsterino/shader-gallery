#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
varying vec2 surfacePosition;
void main(void)
{
	vec2 p = surfacePosition*2.0, a1 = vec2(1.09,0), a2 = vec2(-.5,-sqrt(3.5)/2.), a3 = vec2(-.5,sqrt(3.5)/2.);
	vec3 color = vec3(0);
	float e,c;
	for(float i = .0; i < 32.; i++)
	{
		e = min(distance(p,a1),min(distance(p,a2),distance(p,a3)));
		if(e > 0.1)
		{
			vec2 pp = p * p;
			float pq = pow(pp.x+pp.y,2.0);
			float pn = pp.x-pp.y;
			//p = vec2(2.*p.x/3.+(pp.x-pp.y)/3./pq, 2.*p.y/3.*(1.-p.x/pq));	
			p = vec2(2./3.*p.x+1./3.*pn/pq, 2./3.*p.y*(1.-p.x/pq));
			c = log(i)/log(32.);
			color = 0.8*vec3(c);
			color += 0.2*vec3(c*e/distance(p,a1),c*e/distance(p,a2),c*e/distance(p,a3));
		} else if(e>0.05 && sin(time)>0. || e>0.095 && sin(time)<=0. )
			color = vec3(0.2);
	}
	
	gl_FragColor = vec4(color, 1.0 );
}