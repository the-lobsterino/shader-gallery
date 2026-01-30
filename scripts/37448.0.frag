#ifdef GL_ES 
precision mediump float; 
#endif 

#extension GL_OES_standard_derivatives : enable 

uniform float time; 
uniform vec2 mouse; 
uniform vec2 resolution; 

#define thickness 0.003 

float rand(float seed)
{
    return fract(sin(seed * 195.2837) * 1720.938);
}

float drawLine(vec2 uv, vec2 p1, vec2 p2) { 

	float a = abs(distance(p1, uv)); 
	float b = abs(distance(p2, uv)); 
	float c = abs(distance(p1, p2)); 

	if ( a >= c || b >= c ) return 0.0; 

	float p = (a + b + c) * 0.5; 

	// median to (p1, p2) vector 
	float h = 2.0 / c * sqrt( p * ( p - a) * ( p - b) * ( p - c)); 

	return mix(1.0, 0.0, smoothstep(0.5 * thickness, 1.5 * thickness, h)); 
} 

vec3 line( vec2 p, vec2 a, vec2 b ) 
{ 
	return vec3(drawLine(p, a, b)); 
} 

mat2 rotate(float angle){
	float c = cos(angle), s = sin(angle);
	return mat2(c, -s, s, c); // a rotation matrix
}

vec2 average(in vec2 a, in vec2 b) 
{ 
	return (a + b) * 0.5; 
} 

vec2 perpendicular(in vec2 a, in vec2 b) 
{ 
	return cross(vec3(normalize(b - a), 1.0), vec3(0.0,0.0,1.0)).xy; 
} 

const int count_edges = 50; 

struct segment{ 
	vec2 a; 
	vec2 b; 
}; 
	
vec2 createBrunch(vec2 pMid, vec2 pEnd, float seed)
{
	vec2 dir = pMid - pEnd;
	float rndAngle = rand(seed);
	float lScale = 0.7;
	vec2 pSplit = dir * rotate(rndAngle) * lScale + pMid;
	
	return pSplit;
}

void splitEdges(float offset, inout int count, inout segment base_edges[count_edges])
{
	segment edges[count_edges];
	float thunderSeed = 0.2;//floor(time*3.0 + rand(0.2));
	float sd = thunderSeed;
	
	for(int i = 0; i < count_edges; i++) 
	{ 
		if(i >= count)
			break;
		vec2 a = base_edges[i].a; 
		vec2 b = base_edges[i].b; 

		vec2 c = average(a, b); 
		c += perpendicular(a, b) * (rand(sd) * 2.0 - 1.0) * offset; 

		edges[i * 2].a = a; 
		edges[i * 2].b = c; 

		edges[i * 2 + 1].a = c; 
		edges[i * 2 + 1].b = b; 
		
		//edges[i + count_edges].a = c;
		//edges[i + count_edges].b = createBrunch(c, b, sd);
		
		sd = rand(sd);
	} 
	
	count *= 2;

	for(int i = 0; i < count_edges; i++)
	{
		if(i >= count)
			break;
		base_edges[i] = edges[i];
	}
	
}

vec3 thunder(in vec2 uv, in vec2 pStart, in vec2 pEnd) 
{ 
	float offsetAmount = 0.15;

	segment edges[count_edges];

	edges[0].a = pStart;
	edges[0].b = pEnd;

	float offset = offsetAmount;
	int count = 1;
	
	for(int i = 0; i < 4; i++)
	{
		splitEdges(offset, count, edges);
		offset *= 0.5;
	} 

	vec3 color = vec3(0.0);
	for(int i = 0; i < count_edges; i++) 
	{ 
		if(i >= count)
			break;
		color += line(uv, edges[i].a, edges[i].b); 
	} 

	return color; 
} 

void main( void ) { 

	vec2 position = ( gl_FragCoord.xy / resolution.xy ); 
	vec2 uv = position * 2.0 - 1.0; 

	vec2 pStart = vec2(-0.5); 
	vec2 pEnd = vec2(0.5); 

	vec3 color = thunder(uv, pStart, pEnd); 

	gl_FragColor = vec4( color , 1.0 ); 

}