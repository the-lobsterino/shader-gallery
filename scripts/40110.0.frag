#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 resolution;
uniform float time;

#define PI 3.14159265359

vec3 rand(vec3 p)
{
	const vec3 k = vec3(0.3183099, 0.3678794 , 0.32812794 );
	p = p*k + k.xyz;
    	return -1.0+2.0 * fract(16.0 * k * fract(p.x* p.y* (p.x+p.y)) );
}


float noise(in vec3 p )
{
	vec3 i = floor(p);
	vec3 f = fract(p);
	
	vec3 u = f * f * (3.0-2.0*f);
	
	vec3 v1 = vec3(0.0, 0.0, 1.0); 
	vec3 v2 = vec3(1.0, 0.0, 1.0);
	vec3 v3 = vec3(0.0, 1.0, 1.0);
	vec3 v4 = vec3(1.0, 1.0, 1.0); 
	
	float a = dot( rand(i + v1), f - v1);
	float b = dot( rand(i + v2), f - v2);
	float c = dot( rand(i + v3), f - v3);
	float d = dot( rand(i + v4), f - v4);
	
	float m  = mix(a, b, u.x);
	float m2 = mix(c, d, u.x);

	float res = mix(m, m2, u.y);
	return res;
}
 

void main()
{
	
	vec2 p = gl_FragCoord.xy / resolution;
	vec2 uv = p * vec2(resolution.x / resolution.y, 1.0);
	
	float f = 0.0;
	vec3 col = vec3(0.0);
	
		f = noise(32.0 * vec3(uv, time * 0.1));	

	f = 0.5 + 0.5 * f;
	f *= smoothstep(0.0, 0.005, abs(p.x-0.5));
	
	col += vec3(f);
	
	gl_FragColor = vec4(col, 1.0);

}