#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

// Playing around with custom cell-shading... See my shadertoy for original https://www.shadertoy.com/view/mdjGRR

#define ITER 100
#define MAX_DIST 100.
#define MIN_DIST 0.001
	
struct light
{
	vec2 p;
	float i;
	vec3 c;
};
	
#define LINTENS(x, y, lp, uv) (x / pow(length(lp - uv), y))
	
#define RAND(n) (fract(sin(n) * 43758.5453123))

#define GEN(uv, a) (vec2(uv.x * cos(a) - uv.y * sin(a), uv.y * cos(a) + uv.x * sin(a)))
	
float geo(vec2 p)
{
	float f = 1.;
	vec2 pp = p;
	pp.x = p.x + sin(p.x * time * 0.325)*0.025 + (p.y * 2.2);
	pp.x = p.x + 0.25;
	pp.y = p.y + cos(p.y * 12.5 + time * 0.125)*0.085;
	
	for(float i = 1.; i < 15.; i++)
	{	
		vec2 cp = GEN(vec2(pp.x - (0.08 * (i * RAND(i * 1.5))), pp.y + sin(time * 0.4)*0.001), time * (i * 0.05));
		f = min(f, length(pp - cp)-0.005);
	}

	return f;	
}

float march(vec2 o, vec2 d)
{
	float t = 0.;
	for(int i = 0; i < ITER; i++)
	{
		vec2 cp = o + (d * t);
		float g = geo(cp);
		
		t += g;
		
		if(g < MIN_DIST || t > MAX_DIST) break;
	}
	
	return t;
}

float lighting(vec2 p, light l)
{
	vec2 ld = normalize(l.p - p);
	
	float r = 1.0;
	float t = 0.0;
	float d = length(l.p - p);
	
	for(int i = 0; i < 10; i++)
	{
		vec2 pp = p + (ld * 0.0025);
		float s = march(pp, ld);
		r = min(r, 5.0 * s / t);
		t += s;
		if(t < 0.0 || s > 1.0) 
			break;
		if(t*0.95 >= d) break;
	}

	return r ;
}

vec3 bLight(light l, vec2 o)
{
	return l.c * lighting(o, l) * l.i;	
}

void main( void ) 
{
	vec2 uv = ( gl_FragCoord.xy - (0.5 * resolution.xy)) / resolution.y;
	
	vec2 l1p = vec2(0.0, sin(time * 0.55)*0.35);
	light l1 = light(l1p, LINTENS(0.03, 1.0, l1p, uv), vec3(0.4, 0.4, 0.8));
	
	float eff = 0.5 + abs(sin(time * RAND(time)) * 0.25);
	float lDiff = lighting(uv, l1);
	vec3 fcol = bLight(l1, uv);
	
	fcol = mix(fcol, l1.c * lDiff, smoothstep(1. / resolution.y, 0.0, geo(uv))) * eff;
	
	gl_FragColor = vec4(fcol, 1.0 );
}







