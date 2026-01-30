#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D backbuffer;

float fRand(float x)
{
	return fract(3.123+3.245*sin(x*283.172 + 91.22));
}

float fRand(vec2 p)
{
	return fract(2.214+47.2411*sin(p.x*421.213 + p.y*453.143 + 283.55));
}

float fNoise(float x)
{
	float a = fRand(floor(x));
	float b = fRand(ceil(x));
	return mix(a, b, fract(x));
}

float fNoise(vec2 p)
{
	vec2 pf = floor(p);
	vec2 pc = ceil(p);
	float a = fRand(pf);
	float a2 = fRand(vec2(pc.x, pf.y));
	float b2 = fRand(pc);
	float b = fRand(vec2(pf.x, pc.y));
	
	return mix(mix(a, a2, fract(p.x)), mix(b, b2, fract(p.x)), fract(p.y));
}

vec2 fNoise2(vec2 p)
{
	float x = fNoise(p);
	float y = fNoise(p+942.42);
	return vec2(x,y);
}

vec2 fVel(vec2 p)
{
	return fNoise2(p*10.0 + time) - 0.5;	
}


vec3 fBrush(vec2 p)
{
	float r = length(p);
	float theta = atan(p.x, p.y) + time/4.0;
	
	float arms = 8.0;
	float curvature = 15.0 + 30.0*sin(time) + sin(r*30.0)*20.0 + sin(theta*4.0)*20.0;
	float thinness = 0.2;
	
	float f = sin(r*curvature + theta*arms);
	f *= smoothstep(0.075, 0.2, 2.0*r*f);
	
	float f2 = (thinness - abs(f))/thinness;
	f *= smoothstep(0.5, 0.3, r * (1.0 + sin(time*3.0) + abs(f)));
	f2 *= smoothstep(0.5, 0.2, r);
	
	vec3 color;
	color.r = f2;
	color.g = f;
	color.b = sin(f*3.0);
	
	return vec3(color);	
}

void main( void ) {
	vec2 uv = gl_FragCoord.xy / resolution.xy;
	vec2 p = uv - 0.5;
	p.x *= p.x/p.y;

	vec3 color = vec3(0.0);
	
	vec2 vel = fVel(p)*0.005;
	vec3 prevP = texture2D(backbuffer, uv + vel).rgb;
	
	float r = length(uv-0.5);
	prevP *= smoothstep(2.0, 0.4, r);
	
	color = prevP * 0.99 + 0.05*fBrush((uv - mouse)*4.0);
	

	gl_FragColor = vec4(color, 1.0 );

}