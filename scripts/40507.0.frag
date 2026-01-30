precision highp float; 
uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;

//good work, whoever made this

vec2 hash(in vec2 p) 
{
    return cos(time *.8 + sin(mat2(17., 5., 3., 257.) * p - p) * 1234.5678);
}

float noise( in vec2 p )
{
	const float K1	= (sqrt(3.)-1.)/2.;
	const float K2	= (3.-sqrt(3.))/6.;
	vec2 i 		= floor(p + (p.x + p.y) * K1);    
	vec2 a 		= p - i + (i.x + i.y)*K2;
    	vec2 o 		= (a.x > a.y) ? vec2(1., 0.) : vec2(0., 1.);
    	vec2 b 		= a - o + K2;
    	vec2 c 		= a - 1.0 + 2.0 * K2;
    	vec3 h 		= (.5 - vec3(dot(a, a), dot(b, b), dot(c, c))) * 3.;
    	vec3 n 		= vec3(dot(a, hash(i)), dot(b, hash(i + o)), dot(c, hash(i+1.0)));
    	return dot(n, h*h*h* 2.0 *h) * 0.5 + 0.5;
}

void main() 
{ 
	vec2 p 	= gl_FragCoord.xy / resolution;
	p 	= 2.0 * p - 1.0;
	p.x 	*= resolution.x / resolution.y;

	
	//p += 10.;
	//p *= .5;
	//p += mouse * 100.;
	p.x *= 0.2;
	p.y *= 1.;
	
	float f = 1.;
	float a = .5;
	float n = 0.1;
	for(int i = 0; i < 8; i++)
	{
		n += noise(p * f + noise(p * f ) * 0.5) * a;
		p = p.yx;
		f *= 2.;		
		a *= .5;
		
	}
	//water = vec4(n) * vec4(.0,0.1,0.9,0.0);
	
	gl_FragColor = vec4(n) * vec4(10.,1.5,0.1,0.0);
}