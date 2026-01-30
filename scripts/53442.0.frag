precision highp float;


#define PI 3.14152
#define PI2 6.28318530718
#define GS 10.0 //in pixel unit
uniform vec2 resolution;
uniform sampler2D backbuffer;///min:l;mag:l;s:c;t:c;
uniform vec2 mouse;
uniform float time;
uniform float startRandom;


vec2 touch = mouse *resolution.xy;


vec2 randDir(vec2 seed)
{
	seed += vec2(1.0,1.0)*startRandom*100.0;
float angle = PI2 * fract(sin(dot(seed.xy,vec2(12.9898,78.233)))*471.522) +time;
return vec2(cos(angle),sin(angle));
}

vec3 rand01(float seed)
{
	seed += startRandom*10.0;
	vec3 ret;
	ret.x = fract(sin(seed*79007.423)*7984.12);
	ret.y = fract(sin(seed*81121.217)*4495.32);
	ret.z = fract(sin(seed*79512.122)*6173.29);
return ret;
}

vec2 dither(void)
{
return randDir(gl_FragCoord.xy + vec2(time,2.24-7.80*time));
}

vec2 toDir(vec2 rg)
	{
		return clamp(rg*2.0 - 1.0, -1.0,1.0);
	}

vec2 toCol(vec2 dir)
	{
		return clamp(dir*0.5 + 0.5,0.0,1.0);
	}

vec2 rotateDir(vec2 v,float a)
{
	float ca = cos(a);
	float sa =sin(a);
	return mat2(vec2(ca,sa),vec2(-sa,ca))*v;
}


/*
vec2 Interpolate(vec2 fc)//bilinear, depends with GS
{
	vec2 fcg = fc/GS;
	vec2 gridElem = floor(fcg);
	vec2 weights = fcg - gridElem;

	return mix(mix(randDir(gridElem),randDir(gridElem + vec2(1.0,0.0)),weights.x),
		     mix(randDir(gridElem + vec2(0.0,1.0)),randDir(gridElem + vec2(1.0,1.0)),weights.x),weights.y);

	        }


vec3 Propagate(vec4 fc,vec2 pr)
{
	vec2 dir = SP*(Interpolate(fc.xy) +DS*dither() + pr);
	return texture2D(backbuffer,fc.zw-dir/resolution.x).xyz;

}


vec3 Sink(float id, vec4 fc,float p)//p = period
{
	float tOff = 150.0*fract(4795.715*id);
	float tId = floor((time+tOff)/p);
	float amp = ((time+tOff)/p-tId);
	vec3 col = rand01(100.0/(1.0+id)+tId)*sin(amp*PI2)/(6.0*p);
	vec3 pos = rand01(100.0/(1.5+id)+tId);
	pos.xy *= resolution.xy-2.0*B;
	pos.xy += B + vec2(0.0,-fract(2.0*amp)*mix(0.3,0.6,pos.z)*resolution.y);

	float l = dot(fc.xy-pos.xy,fc.xy-pos.xy)/(GS2*GS2);

	l = fract(max(0.0,1.0-l)*(1.0-amp)*2.5);

	return l*col;

}

vec2 SinkDir(float id, vec4 fc,float p)//p = period
{
	float tOff = 50.0*fract(4795.715*id);
	float tId = floor((time+tOff)/p);
	float amp = ((time+tOff)/p-tId);
	float strength = 3.0*sin(amp*PI);

	vec3 pos = rand01(100.0/(1.9+id)+tId*1.24);
	pos.x *= resolution.x;
	pos.y = amp*resolution.y;

	float l = length(fc.xy-pos.xy);

	return strength*(fc.xy-pos.xy)/l*smoothstep(0.0,1.0,1.0-6.0*l/resolution.y);

}
*/


void main(void) {
	vec4 fc = vec4(gl_FragCoord.xy,gl_FragCoord.xy/resolution.xy);
     vec2 ci =texture2D(backbuffer,fc.zw).xy;
	vec4 c = texture2D(backbuffer,fc.zw + (toDir(ci)*GS+.2*dither())/resolution.x);
	vec2 d =toDir(c.xy);
	d = rotateDir(d*0.9999,0.72);
vec3 color = c.xyz;
	color.xy = toCol(d);

if (length(color.xy-vec2(0.5,0.5))<0.02)
	color.xyz = rand01(time + gl_FragCoord.x + gl_FragCoord.y);
	
	gl_FragColor = vec4(color, 1.0);
}
