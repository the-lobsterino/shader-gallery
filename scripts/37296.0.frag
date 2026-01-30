#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

// Bug Rorschach
// shadertoy.com/user/zackpudil/sort=newest

// mouse.x ... iterations
// mouse.y ... zoom

mat2 r(float a) { return mat2(cos(a), sin(a), -sin(a), cos(a)); }

float de(vec2 p) 
{
	p *=  1.0;
	float d = 1.0;
	for(int i = 0; i < 17; i++) {
		p = abs(p)/dot(p, p) - vec2(0.5);
		p *= r(0.7*p.x + 4.5);
		d = min(d, max(dot(p, p), 0.9*abs(cos(p.y) + sin(p.x))));
		if (float(i)+17.-mouse.x*17. > 17.) break; 
	}
	return d;
}

vec3 bump(vec2 p, float e, float z) 
{
	vec2 h = vec2(e, 0.0);
	vec3 g = vec3(	de(p + h) - de(p - h),
	                de(p + h.yx) - de(p - h.yx),z);
	return normalize(g);
}

float edge(vec2 p, float e) 
{
	vec2 h = vec2(e, 0.0);
	float d = de(p);
	vec2 n1 = vec2(de(p + h), de(p + h.yx));
	vec2 n2 = vec2(de(p - h), de(p - h.yx));
	vec2 vv = abs(d - 0.5*(n1 + n2));
	float v = min(1.0, pow(vv.x + vv.y, 0.55));
	return clamp(v, 0.0, 1.0);
}

const vec3 baseColor = vec3(0.4, 1.0, 4.9);

void main( void ) 
{
	vec2 p = (-resolution + 2.0*gl_FragCoord.xy)/resolution.y;
	p *= 0.8+10.0*mouse.y;
	vec3 col = vec3(0);
	
	vec3 rd = normalize(vec3(p, 1.97));
	vec3 sn = bump(p, 0.01, -0.3);
	
	col += pow(clamp(dot(-rd, sn), 0.0, 1.0), 66.0);
	col += baseColor *(vec3(edge(p, 0.01)));
//	col = mix(col, vec3(4.0, 0.3, 0.3), 1.0 - smoothstep(0.01, 0.11, length(p)));
//	col = 1.0 - exp(-0.9*col);
	
	col = pow(abs(col), vec3(0.5));
	gl_FragColor = vec4(col, 1);
}