#ifdef GL_ES
precision mediump float;
#endif


#define STEPS 50
#define LIGHTPASSES 4
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec2 c = vec2(0.5,0.5*resolution.y/resolution.x);
vec3 wallColor = vec3(1.,1.,1.);

/*by Olivier de Schaetzen (citiral)
haven't really seen anything like this before, so either I don't check enough shaders or I might have made something original once ;)
*/

//random function not by me, found it somewhere on the internet!
float rand(vec2 n)
{
  return 1. * 
     fract(sin(dot(n.xy, vec2(12.898, 78.33)))* 43758.5453);
}

vec3 getColor(vec2 p)
{	
	//if (p.x >= 0.1 && p.x <= 0.19 && p.y >= 0.1 && p.y <= 0.19) {
	//	return wallColor;
	//}
	
	vec2 pp = p;
	vec2 ppp = p;
	
	p.x += sin(time*10.)*0.04;
	p.y += cos(time*10.)*0.04;
	if (length(p-c) <= 0.01) {
		return wallColor;	
	}
	
	
	pp.x += cos(time*5.)*0.08;
	pp.y += sin(time*5.)*0.08;
	if (length(pp-c) <= 0.02) {
		return wallColor;	
	}
	
	ppp.x += sin(time*2.5)*0.15;
	ppp.y += cos(time*2.5)*0.15;
	if (length(ppp-c) <= 0.02) {
		return wallColor;	
	}
	
	return vec3(0.3,0.3,0.3);
}

vec3 getLighting(vec2 p, vec2 lp)
{
	vec2 sp = p;
	vec2 v = (lp-p)/float(STEPS);
	
	for (int i = 0 ; i < STEPS ; i++) {
		if (getColor(sp) == wallColor) {
			return length(p-lp)/vec3(1.,1.,1.) + 1./length(p-lp)*0.075*vec3(1.0,0.5*(sin(time)+0.1),0.7);
		}
		sp += v;
	}
	
	return vec3(1.0,1.0,1.0)+1./length(p-lp)*0.075*vec3(1.0,0.5*(sin(time)+1.),0.6);
}

vec3 blendLighting(vec2 p, vec2 lp)
{	
	vec2 r;
	vec3 c = vec3(0.,0.,0.);
	
	for (int i = 1 ; i <= LIGHTPASSES ; i++) {
		r = vec2(rand(sin(time*float(i))+p.xy)*0.03-0.015,rand(cos(time*float(i))+p.yx)*0.03-0.015);
		c += getLighting(p,lp+r)/float(LIGHTPASSES);
	}
	
	return c;
}

void main( void ) {

	vec2 p = gl_FragCoord.xy/resolution.xy;
	vec2 lp = mouse.xy;
	p.y *= resolution.y/resolution.x;
	lp.y *= resolution.y/resolution.x;	
	
	
	gl_FragColor = vec4(getColor(p)*blendLighting(p,lp),1.);
}