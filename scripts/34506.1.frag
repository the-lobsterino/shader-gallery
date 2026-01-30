#ifdef GL_ES
precision highp float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

// Star Nest by Pablo Román Andrioli
// Modified a lot.

// This content is under the MIT License.
#define iterations 6
#define formuparam 0.980
#define volsteps 12
#define zoom   8.900
#define stepsize1 0.190
#define tile   0.850
#define speed  0.1

	#define brightness 0.01
#define darkmatter 0.400
#define distfading 0.760
#define saturation 0.990


void main(void)
{
	//get coords and direction
	vec2 uv=gl_FragCoord.xy/resolution.xy-.5;
	uv.y*=resolution.y/resolution.x;
	vec3 dir=vec3(uv*zoom,1.);
	
	float a2=time*speed+.5;
	float a1=0.9 + .015*time;
	mat2 rot1=mat2(cos(a1),sin(a1),-sin(a1),cos(a1));
	mat2 rot2=rot1;//mat2(cos(a2),sin(a2),-sin(a2),cos(a2));
	dir.xz*=rot1;
	dir.xy*=rot2;
	//dir.yz*=rot2;
	
	
	//from.x-=time;
	//mouse movement
	vec3 from=vec3(0.,0.,0.);
	from+=vec3(.05*time,.05*time,-2.);
	
	from.x-=5.0*mouse.x;
	from.y-=5.0*mouse.y;
	
	from.xz*=rot1;
	from.xy*=rot2;
	//from.yz*=rot2;
	
	//volumetric rendering
	float s=.4,fade=.2;
	vec3 v=vec3(0.4);
	for (int r=0; r<volsteps; r++) {
		vec3 p=from+s*dir*.5;
		p = abs(vec3(tile)-mod(p,vec3(tile*2.))); // tiling fold
		float pa,a=pa=0.;
		for (int i=0; i<iterations; i++) { 
			p=abs(p)/pow(dot(cos(p),p),-0.5 + 0.175*(sin(0.001*time)))-formuparam; // the magic formula
			a+=abs(pow(length(p),-0.8)-pa-1.2); // absolute sum of average change
			pa=pow(length(p),-0.9);
		}
		float dm=max(0.,darkmatter-a*a*.001); //dark matter
		a*=a*a*2.; // add contrast
		if (r>3) fade*=1.-dm; // dark matter, don't render near
		//v+=vec3(dm,dm*.5,0.);
		v+=fade;
		v+=vec3(pow(s,1.0),pow(s,0.5),pow(s,-0.25))*a*brightness*fade; // coloring based on distance
		s+=stepsize1;
	fade*=distfading; // distance fading
		}
	v=mix(vec3(length(v)),v,saturation); //color adjust
	gl_FragColor = vec4(v*.01,1.);	
	
}