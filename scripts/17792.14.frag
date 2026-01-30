#ifdef GL_ES

precision highp float;

#endif

// Based on Face shader

uniform float time;

uniform vec2 mouse;

uniform vec2 resolution;

 
#define WOBBLINESS 25.0
vec3 cell(vec2 p, float radius )
{		
	float dp = dot(p * WOBBLINESS * sin(time), vec2(1.0, 1.0));
	float dpp = 0.01 * sin(dp);
	float lp = length(p) - dpp;
	
	if (length(lp) < radius)
	{
             return vec3( 0.2, 0.0, length(p)) + (0.6 - length(p));
	}
	else
	{
	     return vec3(1.0 - length(p));
	}
}

void main( void )
{
	vec2 p = ( (gl_FragCoord.xy - resolution.xy/2.0) / vec2(min(resolution.x, resolution.y)) ) * vec2( 2.0 );
	gl_FragColor = vec4( vec3( cell( p, 0.3)), 1.0 );
}
