#ifdef GL_ES
precision highp float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define PI 3.14159265359
#define V 1.41421356237

float ring(vec2 uv, vec2 center, float ri, float re)
{
	return smoothstep(ri, ri*1.025, distance(center,uv)) - smoothstep(re, re*1.025, distance(center, uv));
}

float angle(vec2 uv, vec2 center)
{
	vec2 d = uv - center;
	return 1.0 - (atan(d.y, -d.x)+PI)/(2.0*PI);
}

float box(vec2 uv, vec2 b, vec2 t)
{
	return (step(b.x, uv.x) - step(t.x, uv.x)) * (step(b.y, uv.y) - step(t.y, uv.y));
}

vec4 hsv2rgb(float h, float s, float v)
{
	const float szreg = 1.0/6.0;
	float r = (1.0 - smoothstep(szreg, 2.0*szreg, h)) + smoothstep(4.0*szreg, 5.0*szreg, h);
	float g = smoothstep(0.0, szreg, h) - smoothstep(0.5, 0.5+szreg, h);
	float b = smoothstep(2.0*szreg, 3.0*szreg, h) - smoothstep(5.0*szreg, 1.0, h);
	return v * vec4(r,g,b,1.0);
}

void main()
{

	vec2 uv = 2.0 * gl_FragCoord.xy / resolution - 1.0;
	float a= resolution.x / resolution.y;
	uv.x *= a;
	
	vec2 center = vec2(-0.75, 0.0);
	float r1 = 0.2;
	float r2 = 0.6;
	
	float h = fract(angle(uv, center) + time * 0.5);
	float v = smoothstep(r1, r2, distance(uv, center));
	
	vec2 ms = 2.0 * mouse - 1.0; ms.x *= a;
	vec4 msc = hsv2rgb(fract(angle(ms, center) + time * 0.5),0.0,smoothstep(r1, r2, distance(ms, center))*0.5+0.5);
		
	gl_FragColor = ring(uv, center, r1, r2) * hsv2rgb(h,0.0,0.5+v*0.5) + msc * box(uv, vec2(0.2,-0.3), vec2(0.8,0.3));

}