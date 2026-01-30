#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


float hex(vec2 p) 
{
  p.x *= 0.57735*2.0;
	p.y += mod(floor(p.x), 2.0)*0.5;
	p = abs((mod(p, 1.0) - 0.5));
	return abs(max(p.x*1.5 + p.y, p.y*2.0) - 1.0);
}

float hex2(vec2 p) 
{
	p.y += mod(ceil(p.y), 1.);
	p = abs((mod(p, 0.8) - 0.4));
	return abs(max(p.x + p.x, p.y * 2.) - 1.);
}

float plasma(vec2 c)
{	
    float v = 0.0;
    v += sin((c.x+time*3.));
    v += sin((c.y+time)/2.0);
    v += sin((c.x+c.y+time)/3.0);
    c += vec2(sin(time/13.0), cos(time/17.0));
    v += sin(sqrt(c.x*c.x+c.y*c.y+11.0)+time);
    v = v/0.2;
    return v;	
}

void main( void ) {

	vec2 pos = gl_FragCoord.xy - resolution / 2.;
	vec2 p = 70. * pos / resolution.x;
	float s = plasma(p);
	float  r = .5 + .035 * s;
	gl_FragColor = vec4(smoothstep(r-.1, r+.1, hex2(p)));
}