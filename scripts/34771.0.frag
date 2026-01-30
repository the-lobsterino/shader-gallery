#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;

float starFunc(vec3 p)
{
	float a = 0.0;
	float fp = 0.7550;
	const int n =12;
	float pa = 0.;
	
	for(int i = 0; i < n; ++i)
	{
		p=abs(p)/dot(p,p)-fp;
		a+=abs(length(p)-pa);
		pa=length(p);
	}
	
	a /= float(n);
	return pow(a,6.)*.125;
}

vec3 galaxy(vec3 start, vec3 dir)
{
    	vec3 p = start+dir*30.0;
    	vec3 c = vec3(starFunc(p)) * vec3(1.7,1.4,2.0);
	
	p = start+dir*1.0;
 	c += vec3(starFunc(p)) * vec3(1.2,0.8,3.0);
	
	p = start+dir*.1;
    	c += vec3(starFunc(p)) * vec3(1.7,1.2,1.4);
    
	return c*0.02;
}



void main( void ) {

	vec2 p = surfacePosition*4.;

	float an = 1.5+0.03*time;
	
	float a2 = 0.9;
	float a3 = -1.9;
	
	mat2 rot_a2 = mat2(cos(a2),sin(a2),-sin(a2),cos(a2));
	mat2 rot_a3 = mat2(cos(a3),sin(a3),-sin(a3),cos(a3));
	
	vec3 ro = vec3( 1.0*cos(an),  2.0*cos(an) ,5.);
	ro.xz *= rot_a2;
	ro.yz *= rot_a3;
	
	vec3 rd = vec3(p.x*cos(an) + p.y*sin(an),p.x *(-sin(an)) + p.y*cos(an), 0.1 - tan(time*0.003));
	
	rd.xz *= rot_a2;
	rd.yz *= rot_a3;
	
	
	vec3 bckg = galaxy(ro,rd);
        
	vec3 col = bckg;
	
	col = pow(col,vec3(0.5));
	
	gl_FragColor = vec4(col,1.0);

}