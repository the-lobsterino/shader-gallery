#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec3 rep(vec3 pos)
{
	vec3 r = mod(pos,4.) -2.;
	return r;
}

float sdBox(vec3 p)
{
	p = abs(p) -(0.9*sin(time));
	float d = max(max(p.x, p.y),p.z);
	return d;
}

float sdBox2(vec3 p)
{
	p =abs(p) -(0.3*sin(time)+0.3);
	float d= max(p.x,p.y);
	return d;
}


float destFunc(vec3 p)
{
	float d = min(sdBox(rep(p)),sdBox2(rep(p)));
	return d;
}

mat2 rot(float a)
{
	float c=cos(a), s=sin(a);
	return mat2(c,s,-s,c);
}

const float pi=acos(-1.);

vec2 pmod(vec2 p, float t)
{
	float nr = atan(p.x,p.y)+pi/t;
	float np = pi*2./t;
	float n = floor(nr/np)*np;
	return p*rot(-n);
}


void main( void ) {

	vec2 p =(gl_FragCoord.xy*2. - resolution) / resolution.y;
	vec3 cameraPos = vec3(0.,0.,-10.+time*10.*2.);
	vec3 rayDir = normalize(vec3(pmod(p*rot(time*sin(time)*0.0005*cos(time)),8.), 1.));
	
	float col=0.;
	
	float depth = 0.;
	
	for(int i =0 ;i <64;i++)
	{
		vec3 rayPos = cameraPos + rayDir *depth;
		float dest = destFunc(rayPos);
		
		dest = max(abs(dest),0.02);
		
		depth += dest;
	}
	
	col = exp(-0.0005*depth*depth);
	
	gl_FragColor = vec4(col*sin(time),col*cos(time),col,1.);
			
	

}