//Copyright (c) 2019-07-13 by Angelo Logahd
//Portfolio: https://angelologahd.wixsite.com/portfolio
//Based on https://www.iquilezles.org/www/articles/menger/menger.htm and https://www.shadertoy.com/view/4sX3Rn

#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const float INF 		= 1.0 / 0.0;

#define saturate(x) 		clamp(x, 0.0, 1.0)

#define MENGER_ITERATIONS	3
#define SOFT_SHADOW_STEPS 	32

#define INTERSECT_STEPS		64
#define INTERSECT_MIN_DIST	0.002
#define INTERSECT_MAX_DIST	20.0


float sdUnitBox(vec3 p)
{
    vec3 d = abs(p) - vec3(1.0);
    return min(max(d.x, max(d.y, d.z)), 0.0) + length(max(d, 0.0));
}

vec4 map(in vec3 p)
{	
    float d = sdUnitBox(p);
    vec4 res = vec4(d, 1.0, 0.0, 0.0);
	
    float s = 1.5;
    for(int i = 0; i < MENGER_ITERATIONS; ++i)
    {	 
	p.x += time * 0.3;
	p.y += sin(time * 0.3) * 0.5;
	    
        vec3 a = mod(p * s, 2.1) - 1.0;
        s *= 8.0;
        vec3 r = abs(1.0 - 3.0 * abs(a));
        float da = max(r.x, r.y);
        float db = max(r.y, r.z);
        float dc = max(r.z, r.x);
        float c = (min(da, min(db, dc)) - 0.85) / s;

        if(c > d)
        {
            d = c;
            res = vec4(d, min(res.y, 0.2 * da * db * dc), 0.0, 1.0);
        }
    }
    
    return res;
}

vec4 intersect(in vec3 ro, in vec3 rd)
{
    float t = 0.0;
    vec4 res = vec4(-1.0);
    vec4 h = vec4(1.0);
    for (int i = 0; i < INTERSECT_STEPS; i++ )
    {
	if(h.x < INTERSECT_MIN_DIST || t > INTERSECT_MAX_DIST) 
	{
	    break;
	}
	
        h = map(ro + rd * t);
        res = vec4(t, h.yzw);
        t += h.x;
    }

    if (t > INTERSECT_MAX_DIST) 
    {
	res = vec4(-1.0);
    }
    
    return res;
}

float softshadow(in vec3 ro, in vec3 rd)
{
    float res = 1.0;
    float t = 0.0;
    for (int i = 0; i < SOFT_SHADOW_STEPS; ++i)
    {
	vec3 pos = ro + rd * t;
        float h = map(pos).x;
        res = min(res, float(SOFT_SHADOW_STEPS) * h / t);
        if(res < 0.101)
	{
	    break;
	}
        t += clamp(h, 0.01, 0.2);
    }
    return saturate(res);
}

vec3 calcNormal(in vec3 pos)
{
    vec3 eps = vec3(0.001, 0.0, 0.0);
    vec3 n;
    n.x = map(pos + eps.xyy).x - map(pos - eps.xyy).x;
    n.y = map(pos + eps.yxy).x - map(pos - eps.yxy).x;
    n.z = map(pos + eps.yyx).x - map(pos - eps.yyx).x;
    return normalize(n);
}

vec3 render(in vec3 ro, in vec3 rd, float intensity)
{
    vec3 color = vec3(0.5);
    vec4 res = intersect(ro,rd);
    if(res.x > 0.0)
    {
        const vec3 light1 = vec3(0.5, 0.5, -0.5);
		
	vec3 pos = ro + res.x * rd;
	
        vec3 baseColor = vec3(saturate(sin(time * 0.5)), saturate(cos(time * 0.3)), saturate(sin(time * 0.4)));
	vec3 ambient = vec3(0.2) * baseColor;
		
	vec3 normal = calcNormal(pos);
	vec3 reflection = reflect(rd, normal);
	
	float occ = res.y;
	float shadow1 = softshadow(pos + 0.001 * normal, light1);
	
	vec3 diffuse = baseColor * shadow1 * occ;
		
	color = diffuse + ambient;		
	color += 0.8 * smoothstep(0.0, 0.1, reflection.y) * softshadow(pos + 0.01 * normal, reflection);
    }

    return pow(color * intensity, vec3(0.4545));
}

void main( void ) 
{
    vec2 p = 2.0*(gl_FragCoord.xy / resolution.xy) - 1.0;
    p.x *= resolution.x / resolution.y;
	
    // camera
    vec3 ro = vec3(2.5 * sin(time * 0.5), 3.0, -3.5);
    vec3 ww = normalize(vec3(0.0) - ro);
    vec3 uu = normalize(cross(vec3(0.0, 1.0, 0.0), ww));
    vec3 vv = normalize(cross(ww, uu));
    vec3 rd = normalize(p.x * uu + p.y * vv + 2.0 * ww);

    vec3 color = render(ro + vec3(0.0, -1.0, 0.0), rd, 0.5);
    color += render(ro + vec3(0.0, 1.0, 0.0), rd, 0.05);
    
    gl_FragColor = vec4(color, 1.0);
}