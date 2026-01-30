#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float hash(float n)
{
	return fract(sin(n)*43758.5453);	
}

float noise(in vec2 x)
{
	vec2 p = floor(x);
	vec2 f = fract(x);
	f = f*f*(3.0-2.0*f);
	float n = p.x + p.y * 57.0;
	float res = mix(mix(hash(n+0.0), hash(n+1.0), f.x),
			mix(hash(n+57.0), hash(n+58.0), f.x), f.y);
	return res;
}

float fbm(vec2 p)
{
	float f = 0.0;
	f += 0.5000*noise(p); p *= 2.02;
	f += 0.2500*noise(p); p *= 2.03;
	f += 0.1250*noise(p); p *= 2.04;
	f += 0.0625*noise(p); p *= 2.01;
	f /= 0.9375;
	return f;
}

void main( void ) {

	vec2 uv = gl_FragCoord.xy / resolution.xy;
	vec2 p = -1.0 + 2.0 * uv;
	float f = fbm(4.0 * p);	
	vec3 col = vec3(f);
		
	gl_FragColor = vec4(col, 1.0);

}