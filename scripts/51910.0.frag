#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


float PHI = 1.61803398874989484820459 * 00000.1; // Golden Ratio   
float PI  = 3.14159265358979323846264 * 00000.1; // PI
float SQ2 = 1.41421356237309504880169 * 10000.0; // Square Root of Two

float rand(in vec2 coordinate, in float seed){
    return fract(tan(distance(coordinate*(seed+PHI), vec2(PHI, PI)))*SQ2);
}

vec3 image(vec2 pos)
{
	vec3 color;

	
	float t = time;

	float last = floor(t);
	float next = last+1.;
	
	float r1 = rand(pos, last);
	float r2 = rand(pos, next);
	
	float g1 = rand(pos, last+100.);
	float g2 = rand(pos, next+100.);
	
	float b1 = rand(pos, last+10000.);
	float b2 = rand(pos, next+10000.);
	

	color.r = mix(r1,r2, t-last);
	color.g = mix(g1,g2, t-last);
	color.b = mix(b1,b2, t-last);
	
	return color;
}

void main( void )
{

	vec2 position = ( gl_FragCoord.xy / resolution.xy );

	gl_FragColor = vec4(image(position), 0.);

}