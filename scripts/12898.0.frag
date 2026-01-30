#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float Sieve(float p)	{ float c = fract(cos(p*223.1234)*234.5678); return c* (1. - c);}

void main( void ) 
{
	vec2 p = ( gl_FragCoord.xy / resolution.xy ) * 8. - 4.;
	p.x *= resolution.x/resolution.y;
	p*= .001;
	float c= (Sieve((cos(time)*6.+4.)*-.003-pow(.851-length(p),20.)+p.x*p.y*p.x));
	c = pow(c, 0.5) * 2.0;
	vec3 col1 = vec3(sin(c * 2.0),cos(-c * 1.25),cos(c));
	vec3 col2 = vec3(
		  1.5
		, (1.8 * clamp(length(resolution.xy/2.0-gl_FragCoord.xy)/resolution.x, 0.4, 1.0))
		, 0.25 + 0.9 * abs(sin(time * 0.3684))
	);
	gl_FragColor = vec4(col1 * col2,1.0);
}