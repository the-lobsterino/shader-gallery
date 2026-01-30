#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

// Star Nest by Pablo Román Andrioli
// Modified a lot.

// This content is under the MIT License.

#define iterations 14
#define formuparam .54

//(0.5 + 0.5*cos(time))

#define volsteps 8
#define stepsize 0.190

	float a1=0.8;
	
	float a3 = 0.03*time;
	
	mat2 rot1=mat2(cos(a1),sin(a1),-sin(a1),cos(a1));
	mat2 rot2=mat2(cos(a2),sin(a2),-sin(a2),cos(a2));
	mat2 rot3=mat2(cos(a3),sin(a3),-sin(a3),cos(a3));
	
	//from.x-=time;
	//mouse movement
	
		dir.xy *= rot3;

	vec3 from=vec3(.3,0.,0.);
	
	from+=vec3(.05*time,.05*time,-.003*time);
	dir-=vec3(0.1*time,.15*time,-.003*time);
	
	
	//dir.xy *= rot3;
	
	dir.xz*=rot1;
	dir.yz*=rot2;
	
	from.xz*=rot1;
	from.yz*=rot2;
	
	//volumetric rendering
	float s=.4,fade=.2;
	vec3 v=vec3(0.4);
	for (int r=0; r<volsteps; r++) {
		vec3 p=from+s*dir*.5;
		p = abs(vec3(tile)-mod(p,vec3(tile*2.))); // tiling fold
		float pa,a=pa=0.;
		for (int i=0; i<iterations; i++) { 
			p=abs(p)/dot(p,p)-formuparam; // the magic formula
			a+=abs(length(p)-pa); // absolute sum of average change
			pa=length(p);
		}
		float dm=max(0.,darkmatter-a*a*.001); //dark matter
		a*=a*a*2.; // add contrast
		if (r>3) fade*=1.-dm; // dark matter, don't render near
		//v+=vec3(dm,dm*.5,0.);
		v+=fade;
		v+=vec3(s,s*s,s*s*s*s)*a*brightness*fade; // coloring based on distance
		fade*=distfading; // distance fading
		s+=stepsize;
	}
	v=mix(vec3(length(v)),v,saturation); //color adjust
	gl_FragColor = vec4(v*.01,1.);	
	
}