//// + colors 
#ifdef GL_ES
precision highp float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define iGlobalTime (time * 0.5)

vec4 hexagon( vec2 p ) 
{
	vec2 q = vec2( p.x*2.0*0.5773503, p.y + p.x*0.5773503 );
	
	vec2 pi = floor(q);
	vec2 pf = fract(q);

	float v = mod(pi.x + pi.y, 1.0);

	float ca = step(1.0,v);
	float cb = step(2.0,v);
	vec2  ma = step(pf.xy,pf.yx);
    
	return vec4(pi + ca - cb * ma, 0.0, 0.0 );
}

float hash1( vec2  p ) {return fract( p.x  * 1.06 + p.y ); }

void main( void ) 
{
	vec2 pos = (-resolution.xy + 2.0*gl_FragCoord.xy)/resolution.y;
	
    	// distort
	pos.y *= 3.0/dot(pos,pos);
	pos *= 1.0 + 1.7*length(pos);
	
    	vec4 h = hexagon(pos + 0.75*iGlobalTime);
         vec3 color = vec3(0.0);
	float d = hash1(h.xx * 2.0 + 43.2);
	if(d < 0.01)
	{	
		color.r = 1.0;
		color.g = 1.0+d*10.0;
		color.b = 0.25;
	}
	else
	{
		color.r = 1.0-d*10.0;
		color.b = fract(d*15.0)*.6 - d*0.5;
		color.g = fract(d*5.0)*.4 - d*0.5;
	}
	
	
	
	gl_FragColor = vec4( d *60.* color, 1.0 );
}