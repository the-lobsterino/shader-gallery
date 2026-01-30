// warping hexagons, WIP. @psonice_cw
// I'm sure there's a less fugly way of making a hexagonal grid, but hey :)

//  Maybe - Try this...

// Simplify!

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;
uniform vec2 mouse;

#define PI 3.14

// 1 on edges, 0 in middle
float hex(vec2 p, float r2) 
{
	p.x *= 1.16; //no product, simple number, shortened - Chaeris
	p.y += mod(floor(p.x), 4.0)*1.5;
	p = abs((mod(p, 1.00) - 0.50));
	
	return abs(max(p.x*1.5 + p.y, p.y*2.0) - r2);
}

void main(void) 
{ 
	vec2  pos = 2.0* gl_FragCoord.xy/resolution.xy - 1.;
	pos.x *= resolution.x/resolution.y;
	vec2  p   = pos*5.; // Removed the divide - Timmons
	
	float pL = length(p);
	float pT = atan(p.x, p.y)+time*.1;
	p.x = pL*cos(pT);
	p.y = pL*sin(pT);
	
	vec4 bgcolor = vec4(0.5, 0.1, 0.1, 1.0);
	vec4 hexcolor = vec4(0.5, 0.1, 0.1, 1.0);
	
	float r1  = 0.05; //Simplified number2 - Chaeris
	float r2  = 0.3;
	vec4 color = vec4(smoothstep(.0, r1, hex(p,1.0-r2)));
	
	r1 = 0.05;
	r2 = 0.5;
	color *= vec4(smoothstep(.0, r1*4., hex(p, cos(time+p.y*pow(1e10, mouse.x))+1. -r2)));
	
	r1 = 0.05;
	r2 = 0.7;
	color *= vec4(smoothstep(.0, r1*3., hex(p, cos(time+p.x*pow(1e10, mouse.y))+1. -r2)));
	
	r1 = 0.05;
	r2 = 0.9;
	color += vec4(smoothstep(.0, r1*2., hex(p, cos(time+length(p)*pow(1e10, length(mouse)))+1. -r2)));
	gl_FragColor = bgcolor + (1.0 - color) * hexcolor;
}
// Good job mans! - Chaeris, again, sorry for the amount of comments I made :D