
#ifdef GL_ES
precision highp float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform vec2 surfaceSize; 
uniform sampler2D backbuffer;
varying vec2 surfacePosition;

void mainImage( out vec4 fragColor, in vec2 fragCoord, in vec2 iResolution, in vec2 iMouse, in float iGlobalTime );

void main() {
	float scaler = max(resolution.x,resolution.y);
	mainImage( gl_FragColor, (surfacePosition.xy-0.5) * scaler * 6.28, resolution.xy, mouse.yx*resolution.xy*0.1, time*0.5 );
}



#define iterations 12
#define formuparam (0.26)

#define volsteps 6
#define stepsize 0.190

#define zoom   (1.100*sin(time*100.0))
#define tile   (85e-2)
#define speed  (1e-10) 

#define brightness (0.0005 + 0.004*(sin(0.2*time)))
#define darkmatter 0.400
#define distfading 0.460
#define saturation 0.800


void mainImage( out vec4 fragColor, in vec2 fragCoord, in vec2 iResolution, in vec2 iMouse, in float iGlobalTime )
{
	//get coords and direction
	vec2 uv=fragCoord.xy/iResolution.xy-.5;
	uv.y*=iResolution.y/iResolution.x;
	float time=iGlobalTime*speed+0.25;

	vec3 dir=vec3(uv*zoom,1.*sin(time));
	vec3 from=vec3(1.,.5,0.5);
#if 1
	for ( int i = 0; i < 3; i++ ) {
		from+=vec3(.05*time,.05*time,-.03*time*0.1)*3.14*float(i);//*1.5;//*mouse.y*1.3;
		dir-=vec3(0.1*time+float(i)*sin(time),.15*time,-.03*time);
	}
#endif	
	
	vec3 forward = vec3(0.,0.,1.);
	
	//mouse rotation
	float a1 = 3.1415926 * (iMouse.x/iResolution.x-.5); // 0.3
	mat2 rot1 = mat2(cos(a1),sin(a1),-sin(a1),cos(a1));
	float a2 = 3.1415926 * 1.0 * (iMouse.y/iResolution.y-.5); // 0.6
	mat2 rot2 = mat2(cos(a2),sin(a2),-sin(a2),cos(a2));
	dir.xz*=rot1;
	forward.xz *= rot1;
	dir.yz*=rot1;
	forward.yz *= rot1;

	// pan (dodgy)
	from += (iMouse.x/iResolution.x-.5)*vec3(-forward.z,0.,forward.x);
	
	//zoom
	float zooom = iGlobalTime/20.; //4.*iMouse.y/iResolution.y + iGlobalTime/10.; // iGlobalTime/20.;//
	from += forward* zooom;
	float sampleShift = mod( zooom, stepsize );
	float zoffset = -sampleShift;
	sampleShift /= stepsize; // make from 0 to 1
	
	//volumetric rendering
	float s=0.1;
	vec3 v=vec3(0.);
	for (int r=0; r<volsteps; r++) {
		vec3 p=from+(s+zoffset)*dir;// + vec3(0.,0.,zoffset);
		p = abs(vec3(tile)-mod(p,vec3(tile*2.))); // tiling fold
		float pa,a=pa=0.;
		for (int i=0; i<iterations; i++) { 
			p=abs(p)/dot(p,p)-formuparam; // the magic formula
			a+=abs(length(p)-pa); // absolute sum of average change
			pa=length(p);
		}
		//float dm=max(0.,darkmatter-a*a*.001); //dark matter
		a*=a*a; // add contrast
		//if (r>3) fade*=1.-dm; // dark matter, don't render near
		// brightens stuff up a bit
		float s1 = s+zoffset;
		// need closed form expression for this, now that we shift samples
		float fade = pow(distfading,max(0.,float(r)-sampleShift));
		v+=fade;
		// fade out samples as they approach the camera
		if( r == 0 )
			fade *= 1. - sampleShift;
		// fade in samples as they approach from the distance
		if( r == volsteps-1 )
			fade *= sampleShift;
		v+=vec3(2.*s1,4.*s1*s1,16.*s1*s1*s1*s1)*a*brightness*fade; // coloring based on distance
		s+=stepsize;
	}
	v=mix(vec3(length(v)),v,saturation); //color adjust
	fragColor = vec4(v*.01,1.);	
	
	// visualise image gradients. suppression using derivative instructions works well on some
	// speckles but i think the bottom right pixel in each quad doesnt contribute to the derivative (?)
	// and therefore wont be suppressed. I didnt get very far with this kind of approach. I
	// think temporal reprojection is the way to go.
	// http://casual-effects.blogspot.co.uk/2013/08/starfield-shader.html
	/*if( iMouse.z > 0. )
	{
		fragColor = clamp( fragColor, 0. , 1. );
	
		float intensity = fragColor.r + fragColor.g + fragColor.b;
		fragColor = vec4(fwidth(intensity));
	}*/
}
