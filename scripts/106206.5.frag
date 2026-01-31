#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float rand(vec2 co)
{
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

float cubic(vec2 pos)
{
	vec2 rpos = vec2(0.0);
	rpos.x = 1.0 - 3.0 * pow(pos.x,2.0) + 2.0 * pow(abs(pos.x),3.0);
	rpos.y = 1.0 - 3.0 * pow(pos.y,2.0) + 2.0 * pow(abs(pos.y),3.0);
	return rpos.x * rpos.y;
}

float linear(vec2 pos,vec2 grad)
{
	vec2 rpos = vec2(0.0);
	rpos.x = pos.x * grad.x;
	rpos.y = pos.y * grad.y;
	return rpos.x * rpos.y;
}

float wavelet(vec2 pos,vec2 grad)
{
	return cubic(pos) * linear(pos,grad);
}

float perlin(vec2 pos,float fraq)
{
	pos /= fraq;
	vec2 grad00 = vec2(rand(vec2(rand(floor(pos.xy)),0.0)),rand(vec2(rand(floor(pos.xy)),1.0)));
	vec2 grad10 = vec2(rand(vec2(rand(floor(vec2(pos.x+1.0,pos.y))),0.0)),rand(vec2(rand(floor(vec2(pos.x+1.0,pos.y))),1.0)));
	vec2 grad01 = vec2(rand(vec2(rand(floor(vec2(pos.x,pos.y+1.0))),0.0)),rand(vec2(rand(floor(vec2(pos.x,pos.y+1.0))),1.0)));
	vec2 grad11 = vec2(rand(vec2(rand(floor(vec2(pos.x+1.0,pos.y+1.0))),0.0)),rand(vec2(rand(floor(vec2(pos.x+1.0,pos.y+1.0))),1.0)));
	float wave00 = wavelet(mod(pos.xy,1.0),grad00);
	float wave10 = wavelet(mod(vec2(pos.x-1.0,pos.y),1.0),grad10);
	float wave01 = wavelet(mod(vec2(pos.x,pos.y-1.0),1.0),grad01);
	float wave11 = wavelet(mod(vec2(pos.x-1.0,pos.y-1.0),1.0),grad11);
	float wavew0 = wave00 + mod(pos.x,1.0) * (wave10 - wave00);
	float wavew1 = wave01 + mod(pos.x,1.0) * (wave11 - wave01);
	float waveh = wavew0 + mod(pos.y,1.0) * (wavew1 - wavew0);
	return waveh;
}

void main( void )
{
	float alpha = 0.0;
	alpha = perlin(gl_FragCoord.xy,100.0);
	alpha *= 10.0;
	
	gl_FragColor = vec4(1.0,1.0,1.0,alpha);

}