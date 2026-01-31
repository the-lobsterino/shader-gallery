#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const float speed = 0.3;
const float gap = 0.02;

// map defines where the lines move forward and where they move backwards, based on the sign of the result.
float map(vec2 p)
{
#define map1 sin(atan(p.y, p.x)*5.0+length(p)*8.0)
#define map2 sin(atan(p.y, p.x)*8.0)-sin(length(p)*8.0)
#define map3 sin(p.x*8.0)*cos(p.y*8.0)
#define map4 sin(p.x*8.0)
#define map5 sin(atan(p.y, p.x)+length(p)*8.0)

return map5;
	
}

// lmap defines the space the lines are in.
float lmap(vec2 p)
{
#define lmap1 length(p)
#define lmap2 atan(p.y, p.x)/6.28 + length(p)
#define lmap3 atan(p.y, p.x)/6.28 - length(p)
#define lmap4 abs(mod(p.x,0.1)-0.05) + p.y
#define lmap5 abs(mod(p.y,0.1)-0.05) + p.x
#define lmap6 p.x
	
return lmap5;	
	
}

float aaline(float x)
{
	return smoothstep(0.0, 0.1, x) * smoothstep(0.5, 0.6, 1.0-x);
}

void main()
{
	vec2 uv = -1.0 + 2.0*gl_FragCoord.xy / resolution.xy;
	uv.x *= resolution.x / resolution.y;
	float f = map(uv);
	float l = lmap(uv);
	vec3 v = vec3(0.0);
	v += aaline(mod(l + time*speed*sign(f), 0.05)*20.0);
	v *= smoothstep(0.0, gap, abs(f));
	v *= smoothstep(0.0, 0.03, length(uv));
	v += vec3(1, 0, 0)*smoothstep(0.03, 0.0, length(uv));
	gl_FragColor = vec4(v, 1.0) ;
}