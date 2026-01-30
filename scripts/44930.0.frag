#ifdef GL_ES
precision mediump float;
#endif

//made by robobo1221

#define STEPS 64

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec2 c = vec2(0.5,0.5*resolution.y/resolution.x);

float bayer2(vec2 a){
    a = floor(a);
    return fract(dot(a,vec2(.5, a.y*.75)));
}

float bayer4(vec2 a)   {return bayer2( .5*a)   * .25     + bayer2(a); }
float bayer8(vec2 a)   {return bayer4( .5*a)   * .25     + bayer2(a); }
float bayer16(vec2 a)  {return bayer4( .25*a)  * .0625   + bayer4(a); }
float bayer32(vec2 a)  {return bayer8( .25*a)  * .0625   + bayer4(a); }
float bayer64(vec2 a)  {return bayer8( .125*a) * .015625 + bayer8(a); }

vec3 getColor(vec2 p)
{	
	float dst = distance(gl_FragCoord.xy, vec2(.125));
	vec3 actualColor = vec3(smoothstep(0.8, 0.8, /*length(sin(p * 12.0))*/dst));
	
	vec3 color = vec3(1.0 - (1.0 / float(STEPS)) * actualColor);
	color = mix(color, vec3(1.0), smoothstep(0.1, 0.1, vec3(length(p-c))));	
	
	return color;
}

vec3 getLighting(vec2 p, vec2 lp)
{
	vec2 sp = p;
	vec2 v = (lp-p)/float(STEPS);
	vec3 result = vec3(0.0);
	
	float dither = bayer32(gl_FragCoord.xy);
	
	for (int i = 0 ; i < STEPS ; i++) {
		result += 1.0 - getColor(sp + dither * v) ;
		sp += v;
		
	}
	
	return (1.0 - clamp(result, 0.0, 1.0));
}

void main( void ) {

	vec2 p = gl_FragCoord.xy/resolution.xy;
	vec2 lp = mouse.xy;
	p.y *= resolution.y/resolution.x;
	lp.y *= resolution.y/resolution.x;
	
	float mie = 0.2 / distance(p, lp) - 0.2;
	vec3 color = (getLighting(p,lp)) * mie;
	color /= color + 1.0;
	
	
	gl_FragColor = vec4(color,1.);
}