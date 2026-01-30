#ifdef GL_ES
precision highp float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float rand(vec2 uv)
{
	return fract(cos(dot(uv, vec2(12.9898, 4.1414))) * 43758.5453);
}

float noise(vec2 uv)
{
	vec2 v = floor(uv);
	vec2 f = pow(sin(fract(uv)*1.57079632679), vec2(2.0));
	return mix(mix(rand(v                 ), rand(v + vec2(1.0, 0.0)), f.x),
	       mix(rand(v + vec2(0.0, 1.0)), rand(v + vec2(1.0, 1.0)), f.x), f.y)
		* 2.0 - 1.0;
}

float fbm(vec2 uv)
{
	const float fqi = 2.2;
	const float amp = 0.47;
	
	const int octaves = 7;
	
	float r = 0.0;
	float f = 1.0;
	float a = 1.0;
	
	for (int o = 0; o < octaves; ++o)
	{
		r += a * abs(noise(uv * f));
		f *= fqi;
		a *= amp;
	}
	
	return r;
}

void main()
{
	vec2 uv = gl_FragCoord.xy / resolution*4.0 - 8.0;
	float a = resolution.x / resolution.y;
	uv.x *= a;
	
	vec2 tv = vec2(1.0, 1.0);
	tv = normalize(tv) * time;
	
	mat2 b = mat2(fbm(uv-tv*0.21+0.4), fbm(uv-tv*0.16+0.1),
		      fbm(uv-tv*0.34+0.3), fbm(uv-tv*0.28+0.2));
	
	float c = fbm(uv * b);
	
	vec4 color = vec4(0.9, 1.0, 1.1, 1.0);
	
	gl_FragColor = vec4(0.8 * c) * color;
}