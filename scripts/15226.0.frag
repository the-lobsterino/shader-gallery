#ifdef GL_ES
precision mediump float;
#endif

// quadratic bezier curve evaluation
// posted by Trisomie21

#define u_resolution resolution
#define EPSILON 0.000000001
#define PI 3.14159265358979

uniform vec2 resolution;
// uniform vec2 mouse;

float cuberoot( float x )
{
	return sign(x) * pow(abs(x),1.0/3.0);
}
int findRoots(float a, float b, float c, float d, out float r1, out float r2, out float r3)
{
	if (abs(a) > EPSILON)
	{
		float z = 1.0/a;
		float d3 = 1.0/3.0;
		float d27 = 1.0/27.0;
		a = b*z;
		b = c*z;
		c = d*z;
		float p = b-a*a*d3;
		float q = a*(2.0*a*a-9.0*b)*d27+c;
		float ppp = p*p*p;
		float D = q*q+4.0*ppp*d27;
		float delta = -a*d3;
		if (D > EPSILON)
		{
			z = sqrt(D);
			float u = (-q+z)*0.5;
			float v = (-q-z)*0.5;
			u = sign(u)*pow(abs(u),d3);
			v = sign(v)*pow(abs(v),d3);
			r1 = u+v+delta;
			return 1;
		}
		else if (D < -EPSILON)
		{
			float u = sqrt(-p*d3)*2.0;
			float v = acos(-sqrt(-27.0/ppp)*q*0.5)*d3;
			r1 = u*cos(v)+delta;
			r2 = u*cos(v+2.0*PI*d3)+delta;
			r3 = u*cos(v+4.0*PI*d3)+delta;
			return 3;
		}		
		else
		{
			q = sign(q)*pow(abs(q)*0.5,d3);
			r1 = 2.0*-q+delta;
			r2 = q+delta;
			return 2;
		}
	}
	else
	{
		if (abs(b) <= EPSILON && abs(c) > EPSILON)
		{
			r1 = -d/c;
			return 1;
		}
		else
		{
			float D = c*c-4.0*b*d;
			float z = 1.0/(2.0*b);
			if (D > EPSILON)
			{
				D = sqrt(D);
				r1 = (-c-D)*z;
				r2 = (-c+D)*z;
				return 2;
			}
			else if (D > -EPSILON)
			{
				r1 = -c*z;
				return 1;
			}
		}
	}
	return 0;
}
int solveCubic(in float a, in float b, in float c, out float r1, out float r2, out float r3)
{
	float  p = b - a*a / 3.0;
	float  q = a * (2.0*a*a - 9.0*b) / 27.0 + c;
	float p3 = p*p*p;
	float  d = q*q + 4.0*p3 / 27.0;
	float offset = -a / 3.0;
	float singleSolution;
	{ // Single solution
		float z = sqrt(d);
		float u = (-q + z) / 2.0;
		float v = (-q - z) / 2.0;
		u = cuberoot(u);
		v = cuberoot(v);
		singleSolution = offset + u + v;
	}
	float u = sqrt(-p / 3.0);
	float v = acos(-sqrt( -27.0 / p3) * q / 2.0) / 3.0;
	float m = cos(v), n = sin(v)*1.732050808;
	r1 = mix(singleSolution, offset + u * (m + m), step(d, 0.0));
	r2 = offset - u * (n + m);
	r3 = offset + u * (n - m);
	return 3;
}


float DistanceToQBSpline(in vec2 P0, in vec2 P1, in vec2 P2, in vec2 p)
{
	vec2 dP0P = P0-p;
	vec2 dP1P0 = P1-P0;
	vec2 sP0P2 = P0+P2-P1*2.0;
	float a = dot(sP0P2,sP0P2);
	float b = dot(dP1P0,sP0P2)*3.0;
	float c = dot(dP1P0,dP1P0)*2.0+dot(dP0P, sP0P2);
	float d = dot(dP0P,dP1P0);
	float res1, res2, res3;
	
	vec2 sb = dP1P0 * 2.0;

	int n;
	//n = findRoots(a,b,c,d,res1,res2,res3);
	n = solveCubic(b/a,c/a,d/a,res1,res2,res3);

	
	float t;
	vec2 pos;
	
	
	t = clamp(res1,0.0, 1.0);
	pos = P0 + (sb + sP0P2*t)*t;
	float dis = distance(pos, p);
	//return t;
	
	
	t = clamp(res2,0.0, 1.0);
	pos = P0 + (sb + sP0P2*t)*t;
	dis = min(dis, distance(pos, p));
	    
	t = clamp(res3,0.0, 1.0);
	pos = P0 + (sb + sP0P2*t)*t;
	dis = min(dis, distance(pos, p));	    
    	
    	return dis;
}

void main(void)
{
	vec2 position = gl_FragCoord.xy;
	vec2 p[3];
	
	p[0] = vec2(u_resolution.x*.30,u_resolution.y*.40);
	p[1] = vec2(u_resolution.x*.45,u_resolution.y*.70);
	// p[1] = mouse * u_resolution;
	p[2] = vec2(u_resolution.x*.60,u_resolution.y*.60);
	
	float d = DistanceToQBSpline(p[0], p[1], p[2], position);
	
	float lineThickness = 16.0;
	float lineSoftness = 1.0;
	float outline = 2.0;
	d = (d - (lineThickness-1.0)) / lineSoftness;
	if(outline>0.0) d = abs(d)-(outline-1.0);
	
	d = clamp(d, 0.0, 1.0);
	d = mix(0.8, 0.5, d);
	
	//d = fract(d * 0.05);

	gl_FragColor = vec4(d,d,d, 1.0);
}