#ifdef GL_ES
precision mediump float;
#endif

#define STEPS 80
#define LIGHTPASSES 1
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
     fract(sin(dot(n.xy, vec2(12.9898, 78.233)))* 43758.5453);
}

vec3 getColor(vec2 p)
{	
	if (p.x >= 0.1 && p.x <= 0.19 && p.y >= 0.1 && p.y <= 0.19) {
		return vec3(1.,1.,1.);
	}
	
	p.x += sin(time)*0.1;
	p.y += cos(time)*0.1;
	if (length(p-c) <= 0.05) {
		return vec3(1.,1.,0.3);	
	}
	
	return vec3(0.3,0.3,0.3);
}

vec3 getLighting(vec2 p, vec2 lp)
{
	vec2 sp = p;
	vec2 v = (lp- p)/float(STEPS);
	vec3 shadowColor = vec3(1.0,1.0,1.0)+1./length(p-lp)*0.075*vec3(1.0,0.5*(sin(time)+1.),0.6);
	int hiddenCount = 0;
	int alreadyHidden = 0;
	float coef = 1.0;
	//dirty 2 passes to get height of object on b component
	for (int i = 0 ; i < STEPS ; i++) {
		vec3 color = getColor(sp);
		if (color.r == 1.0) {
			coef = color.b;
			break;
		}
		sp += v;
	}
	sp = p;

	for (int i = 0 ; i < STEPS ; i++) {
		if (getColor(sp).r == 1.0) {
			if(getColor(p).r != 1.0 || alreadyHidden > 0)
			{
				
				shadowColor = vec3(0.0);				
			}
			
			hiddenCount = 1;			
		}
		else if(hiddenCount > 0)
		{
			alreadyHidden = 1;
		}
		sp += v * coef;
		
	}
	return shadowColor;
}

vec3 blendLighting(vec2 p, vec2 lp)
{	
	vec2 r;
	vec3 c = vec3(0.,0.,0.);
	
	//for (int i = 1 ; i <= LIGHTPASSES ; i++) {
		//r = vec2(rand(sin(time*float(i))+p.xy)*0.03-0.015,rand(cos(time*float(i))+p.yx)*0.03-0.015);
		c += getLighting(p,lp)/float(LIGHTPASSES);
	//}
	
	return c;
}

void main( void ) {

	vec2 p = gl_FragCoord.xy/resolution.xy;
	vec2 lp = mouse.xy;
	p.y *= resolution.y/resolution.x;
	lp.y *= resolution.y/resolution.x;	
	
	
	gl_FragColor = vec4(getColor(p)*blendLighting(p,lp),1.);
}