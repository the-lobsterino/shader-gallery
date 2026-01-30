#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float circle(vec2 st)
{
	return step(0.5,length(st - vec2(0.5)));	
}

float wave(vec2 st)
{
	float d = length(st);
	return cos(d * 2.4 - sin(time * 0.75) * 2.78) * 0.34;
}

vec3 backColor()
{
	return vec3(sin(time*0.38)*0.14,cos(time*0.75),cos(sin(time)*0.24)*0.45);	
}

vec4 mainImage(vec2 st)
{
	float n = 5.0;
	vec2 f = fract(st * n);
	vec2 i = floor(st * n + 0.5) / n;
	f.x += wave(i);
	f.y -= wave(i);
	float x = 2.0 * f.y + sin(time * 4.2);
	float dis = sin(time * 10.0) * 0.13 * sin(5.0 * f.x) * (-(x-1.0) * (x-1.0) + 1.0);
	
	vec3 color = vec3(1.0);
	color.x = circle(f - vec2(0.0,dis) * 0.54);
	color.y = circle(f + vec2(0.0,dis) * 0.64);
	color.z = circle(f + vec2(dis,0.0) * 0.44);
	color = mix(color,backColor(),0.3);
	return vec4(color,1.0);
}

void main( void ) {

	vec2 pos = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x,resolution.y);
	gl_FragColor = mainImage(pos);
}