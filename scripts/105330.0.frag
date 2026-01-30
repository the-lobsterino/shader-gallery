precision highp float;
uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;
varying vec2 surfacePosition;

const vec3 RGB = vec3(0.0, 2.0, .5);

float snoise(vec3 uv, float res)
{
	const vec3 s = vec3(1e0, 1e2, 1e3);
	uv *= res;
	vec3 uv0 = floor(mod(uv, res))*s;
	vec3 uv1 = floor(mod(uv+vec3(1.), res))*s;
	vec3 f = fract(uv); f = f*f*(3.0-2.0*f);
	vec4 v = vec4(uv0.x+uv0.y+uv0.z, uv1.x+uv0.y+uv0.z, uv0.x+uv1.y+uv0.z, uv1.x+uv1.y+uv0.z);
	vec4 r = fract(sin(v*1e-1)*1e3);
	float r0 = mix(mix(r.x, r.y, f.x), mix(r.z, r.w, f.x), f.y);
	r = fract(sin((v + uv1.z - uv0.z)*1e-1)*1e3);
	float r1 = mix(mix(r.x, r.y, f.x), mix(r.z, r.w, f.x), f.y);
	return mix(r0, r1, f.z)*2.-1.;
}

void main() 
{
	vec2 p = surfacePosition;
	p.y += 0.5;
	p  += sin(p*1.5);
	p.x *= 0.6;
	p.y *= 0.06;
	float color = .5 - (p.y*2.0);
	vec3 coord = vec3(p.x,p.y, .5);
	for(int i = 1; i <= 7; i++)
	{
		float power = pow(2.0, float(i));
		coord.x*= 0.975;
		color += (1.5 / power) * snoise(coord + vec3(0.0,-time*0.0125, time*0.01), power*16.0);
	}
	vec3 cc = vec3(color, pow(max(color,1.0),1.0)*0.0, pow(max(color,.0),1.0)*.5);
	float ff = length(cc);
	cc = vec3(ff * RGB.r, ff * RGB.g, ff * RGB.b);
	gl_FragColor = vec4(cc , 1.0);
}