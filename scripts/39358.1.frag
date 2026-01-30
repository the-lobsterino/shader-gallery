#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


#define RESOLUTION_MAX max(resolution.x, resolution.y)

#ifdef GL_ES
precision mediump float;
#endif


float torus(vec2 position, vec2 radius)
{
	return abs(abs(length(position)-radius.x)-radius.y);
}


float contour(float x)
{
	return 1.-clamp(x * max(resolution.x, resolution.y)/2., 0., 1.);
}


float circle(vec2 position, float radius)
{
	return contour(torus(position, vec2(radius,0.)));
}


vec2 project(vec2 position, vec2 a, vec2 b)
{
	vec2 q	 	= b - a;	
	float u 	= dot(position - a, q)/dot(q, q);
	u 		= clamp(u, 0., 1.);
	return mix(a, b, u);
}


float segment(vec2 position, vec2 a, vec2 b)
{
	return distance(position, project(position, a, b));
}


float line(vec2 p, vec2 a, vec2 b)
{
	return contour(segment(p, a, b));
}


mat2 rmat(float t)
{
	float c = cos(t);
	float s = sin(t);
	return mat2(c, s, -s, c);
}

const float PI = 3.14159265358979;

void main( void ) {
	vec2 sub_uv = (resolution.xy/min(resolution.x, resolution.y));
	vec2 p		= (gl_FragCoord.xy/resolution.xy-.5) * sub_uv;
	vec2 pmouse = (mouse-.5) * sub_uv;

	float radius  	= sqrt(pow(pmouse.x,2.0)+ pow(pmouse.y,2.0));
	float angle = atan(pmouse.x/pmouse.y);
	float result 	= 0.0;
	float rad	= atan(1.);
	float divisions	= float(int(8.*radius*8.));
	for(float i = 0.; i < 100.; i++){
		result 	= max(result, line(p, vec2(0., .0), vec2(0., -radius)*rmat(i*(PI*2.0/divisions)+angle)));
		if(i > divisions){
			break;
		}
			}
	result 		+= circle(p, radius);
	
	gl_FragColor 	= vec4(result);

}