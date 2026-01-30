
// SynapseRed

#ifdef GL_ES
precision mediump float;  
#endif

uniform float time;
//uniform vec2 mouse;
uniform vec2 resolution;
//uniform sampler2D backbuffer;

#define PI 3.14159265359

float s(float x, float b) { return sin(x * 2. * PI * b) / b; }

vec3 sycol;
void SynapeRed(in vec2 pos)
{
	float x = pos.x;
	float y = pos.y;
	float intens;
	for (float j = 1.; j < 16.; j += 1.) 
	{
		float p,p2;
		for (float i = 1.; i < 12.; i += 1.) 
		{
			p += s(x + 0.02 * time*(i/j), pow(2., i));
			p2 += s(y + 0.002 * time*(j/i/2.), pow(2., i));
		}
		p = 0.5 + 0.5 * p;
		p2 = 0.5 + 0.5 * p2;
		
		//intens = 0.001 / abs(p-p2); //0.01 / abs(p - position.y);	
		intens = 0.0004 / (abs(p - p2)*distance(pos, vec2(p2, p)));
		sycol += vec3((1.0+0.4*sin(time))*155./256., 11./256., 17./256.)*intens;
	}
}
void main( void ) 
{
	vec2 position = 0.25+0.5*( gl_FragCoord.xy / resolution.xy );
	SynapeRed(position);
	gl_FragColor = vec4 (sycol, 1.0);
	//gl_FragColor += texture2D(backbuffer, vec2(x, y))*0.000005;
}