#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

//
// fbm
//https://thebookofshaders.com/13/?lan=jp
//

float random(vec2 st)
{
	return fract(sin(dot(st.xy,vec2(12.9898,78.233))) * 43758.5453123);	
}

float noise(vec2 st)
{
	vec2 i = floor(st);
	vec2 f = fract(st);
	
	float a = random(i);
	float b = random(i + vec2(1.0,0.0));
	float c = random(i + vec2(0.0,1.0));
	float d = random(i + vec2(1.0,1.0));
	
	vec2 u = f * f * (3.0 - 2.0 * f);
	
	return mix(a,b,u.x) + (c-a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

float fbm(vec2 st)
{
	const int octaves = 6;
	float value = 0.0;
	float gain = 0.5;
	float amplitude = 0.5;
	vec2 shift = vec2(100.0);
	mat2 rot = mat2(cos(0.5),sin(0.5),-sin(0.5),cos(0.5));
	
	for(int i = 0;i < octaves;++i)
	{
		value += amplitude * noise(st);
		st = rot * st * 2.0 + shift;
		amplitude *= gain;
	}
	return value;
}

vec4 mainImage(vec2 st)
{
	vec3 color = vec3(0.0);
	
	vec2 q = vec2(0.0);
	q.x = fbm(st + 0.12 * time);
	q.y = fbm(st + vec2(0.73));
	
	vec2 r = vec2(0.0);
	r.x = fbm(st + 1.0 * q + vec2(1.7,9.2) + 0.15 * time);
	r.y = fbm(st + 1.0 * q + vec2(8.3,2.8) + 0.126 * time);
	vec2 r2 = vec2(0.0);
	r2.x = fbm(st + 2.0 * r + vec2(3.8,8.2) + 0.244 * time);
	r2.y = fbm(st + 2.8 * r + vec2(4.9,2.5) + 0.435 * time);
	
	float f = fbm(st + r2);
	
	color = mix(vec3(0.301961,0.619 * abs(cos(time*0.25)),0.566),
		    vec3(0.466,0.666,0.798 * abs(sin(time*0.73))),
		    clamp((f*f)*4.0,0.0,1.0));
	color = mix(color,
		    vec3(0.15,0.14 * abs(cos(time*0.73)),0.164),
		    clamp(length(q),0.1,1.0));
	color = mix(color,
		    vec3(0.666 * abs(sin(time)),0.89,0.74),
		    clamp(length(r.x),0.1,1.0));
	
	return vec4(color,1.0);
}

void main( void ) {

	vec2 pos = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x,resolution.y);
	gl_FragColor = mainImage(pos);

}