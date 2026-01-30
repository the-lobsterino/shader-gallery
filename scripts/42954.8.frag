#ifdef GL_ES
precision mediump float;
#endif

#define STEPS 16
#define LIGHTPASSES 1
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec2 c = vec2(0.5,0.5*resolution.y/resolution.x);
vec3 wallColor = vec3(1.,1.,1.);

//Modified by Robobo1221

/*by Olivier de Schaetzen (citiral)
haven't really seen anything like this before, so either I don't check enough shaders or I might have made something original once ;)
*/

//random function not by me, found it somewhere on the internet!
float rand(vec2 n)
{
  return 1. * 
     fract(sin(dot(n.xy, vec2(12.9898, 78.233)))* 43758.5453);
}

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
	
	vec3 actualColor = vec3(smoothstep(0.5, 0.8, length(sin(p * 50.0))));
	
	vec3 color = vec3(1.0 - (1.0 / float(STEPS)) * actualColor);
	color = mix(color, vec3(1.0), smoothstep(0.1, 0.11, vec3(length(p-c))));	
	
	return color;
}

vec3 getLighting(vec2 p, vec2 lp)
{
	vec2 sp = p;
	vec2 v = (lp-p)/float(STEPS) * 1.;
	vec3 resultWeight = vec3(0.0);
	vec3 totalResult = vec3(0.0);
	vec3 result = vec3(0.0);
	
	float dither = bayer16(p * resolution);
	
	for (int i = 0 ; i < STEPS ; i++) {
		result += 1.0 - getColor(sp + dither * v) ;
		sp += v;
		
	}
	
	return (1.0 - clamp(result, 0.0, 1.0));
}

vec3 blendLighting(vec2 p, vec2 lp)
{	
	vec2 r;
	vec3 c = vec3(0.,0.,0.);
	
	for (int i = 1 ; i <= LIGHTPASSES ; i++) {
		r = vec2(0.0 + (float(i - 1)) / float(LIGHTPASSES) * 0.01);//vec2(rand(sin(time*float(i))+p.xy)*0.03-0.015,rand(cos(time*float(i))+p.yx)*0.03-0.015);
		c += getLighting(p,lp+r)/float(LIGHTPASSES);
	}
	
	return c;
}

void main( void ) {

	vec2 p = gl_FragCoord.xy/resolution.xy;
	vec2 lp = mouse.xy;
	p.y *= resolution.y/resolution.x;
	lp.y *= resolution.y/resolution.x;
	
	float mie = 0.2 / distance(p, lp) - 0.2;
	vec3 color = getColor(p)*(blendLighting(p,lp)) * mie;
	color /= color + 1.0;
	
	
	gl_FragColor = vec4(color,1.);
}