#ifdef GL_ES
precision mediump float;
#endif
 
 
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform vec2 surfacesize;
 
#define iterations 4
#define formuparam2 0.89
 
#define volsteps 10
#define stepsize 0.260
 
#define zoom  1.900
#define tile   0.850
#define speed2  0.10
 
#define brightness 0.02
#define darkmatter 0.400
#define distfading 0.560
#define saturation 0.800
 
float triangle(float x, float a)
{

 
 
float output2 = 2.0*abs(  2.0*  ( (x/a) - floor( (x/a) + 0.5) ) ) - 1.0;
return output2;
}
 

float field(in vec3 p) {
	
	//p.z += time*0.0003;
	float strength = 7. + .03 * log(1.e-6 + fract(sin(time) * 4373.11));
	float accum = 0.;
	float prev = 0.;
	float tw = 0.;
	for (int i = 0; i < 6; ++i) {
		float mag = dot(p, p);
		p = abs(p) / mag + vec3(-.5, -.4, -1.0+290.5*cos(time*0.1));
		float w = exp(-float(i) / 7.);
		accum += w * exp(-strength * pow(abs(mag - prev), 2.3));
		tw += w;
		prev = mag;
	}
	return max(0., 5. * accum / tw - .7);
}



void main()
{
   
     	vec2 uv2 = 2. * gl_FragCoord.xy / resolution.xy - 1.;
	vec2 uvs = uv2 * resolution.xy / max(resolution.x, resolution.y);
	

	
	float time2 = time;
               
        float speed = speed2;
        speed = -0.005 * cos(time2*0.02 + 3.1415926/4.0);
          
	//speed = 0.0;

	
    	float formuparam = formuparam2;

	
    
	//get coords and direction
	//vec2 uv=gl_FragCoord.xy/resolution.xy-.5;
	vec2 uv = uvs;
	
	
		       
	//mouse rotation
	float a1 = 0.9;//3.1415926 * (iMouse.x/iResolution.x-.5);
	mat2 rot1 = mat2(cos(a1),sin(a1),-sin(a1),cos(a1));
	float a2 = .6;//3.1415926 * (iMouse.y/iResolution.y-.5);
	mat2 rot2 = mat2(cos(a2),sin(a2),-sin(a2),cos(a2));
		
		

	vec3 p = vec3(uvs / 4., 0) + vec3(1., -1.3, 0.);
	
	p.x -= 0.25*20.0*(mouse.x-0.5);
	p.y -= 0.25*20.0*(mouse.y-0.5);
	
	p.x += 0.25*(5.0*cos(0.01*time)+0.001*time);
	p.y += 0.25*(5.0*sin(0.01*time)+0.001*time);
	p.z += 0.03*time;
	
	p.xz *= rot1;
	p.xy *= rot1;
	p.yz *= -rot2;
	
	p = abs(vec3(tile)-mod(p,vec3(tile*2.))); // tiling fold
	
	float t = field(p);
	
	
	//float v2 = (1. - exp((abs(p.x) - 1.) * 6.)) * (1. - exp((abs(p.y) - 1.) * 6.));
	//v2 = (1. - exp((abs(uv2.x) - 1.) * 6.)) * (1. - exp((abs(uv2.y) - 1.) * 6.));
	
	float v2 =1.0;
	
	vec3 dir=vec3(uv*zoom,1.);
 
	vec3 from=vec3(0.0, 0.0,0.0);
 
                               
        from.x -= 5.0*(mouse.x-0.5);
        from.y -= 5.0*(mouse.y-0.5);
               
               
	vec3 forward = vec3(0.,0.,1.);
               
	
	from.x += 20.0*(1.0)*cos(0.01*time) + 0.001*time;
		from.y += 20.0*(1.0)*sin(0.01*time) +0.001*time;
	
	from.z += 0.01*time;
	
	
	dir.xz*=rot1;
	forward.xz *= rot1;
		
	dir.xy*=rot1;
	forward.xy *= rot1;
	
	dir.yz*=-rot2;
	forward.yz *= -rot2;
	 
	 
	from.xz*=rot1;
	from.xy*=rot1;
	from.yz*=-rot2;
	 
	
	//zoom
	float zooom = (time2-3311.)*speed;
	from += forward* zooom;
	float sampleShift = mod( zooom, stepsize );
	 
	float zoffset = -sampleShift;
	sampleShift /= stepsize; // make from 0 to 1


	
	//volumetric rendering
	float s=0.24;
	vec3 v=vec3(0.);
	
	vec3 backCol2 = vec3(0.);
	for (int r=0; r<volsteps; r++) {
		vec3 p2=from+(s+zoffset)*dir;// + vec3(0.,0.,zoffset);
		
		
		p2 = abs(vec3(tile)-mod(p2,vec3(tile*2.))); // tiling fold
		
		float t3 = field(p2);
		
		
		float pa,a=pa=0.;
		for (int i=0; i<iterations; i++) {
			p2=abs(p2)/dot(p2,p2)-formuparam; // the magic formula
			//p=abs(p)/max(dot(p,p),0.005)-formuparam; // another interesting way to reduce noise
			float D = abs(length(p2)-pa); // absolute sum of average change
			a += i > 7 ? min( 12., D) : D;
			pa=length(p2);
		}
		
		
		//float dm=max(0.,darkmatter-a*a*.001); //dark matter
		a*=a*a; // add contrast
		//if (r>3) fade*=1.-dm; // dark matter, don't render near
		// brightens stuff up a bit
		float s1 = s+zoffset;
		// need closed form expression for this, now that we shift samples
		float fade = pow(distfading,max(0.,float(r)-sampleShift));
		
		backCol2 += mix(.4, 1., v2) * vec3(1.8 * t3 * t3 * t3, 1.4 * t3 * t3, t3) * fade;
		
		//t3 += fade;
		
		v+=fade;
	       		//backCol2 -= fade;

		// fade out samples as they approach the camera
		if( r == 0 )
			fade *= 1. - sampleShift;
		// fade in samples as they approach from the distance
		if( r == volsteps-1 )
			fade *= sampleShift;
		v+=vec3(s1,s1*s1,s1*s1*s1*s1)*a*brightness*fade; // coloring based on distance
		s+=stepsize;
		
		
		
		}
		       
	v=mix(vec3(length(v)),v,saturation); //color adjust
	 
		       
	/*	
	vec4 forCol = vec4(v*.01,1.);
		
	vec4 backCol = mix(.4, 1., v2) * vec4(1.8 * t * t * t, 1.4 * t * t, t, 1.0);
		
	backCol *= 0.2;
	backCol.b *= 1.0;
	
	
	
	
	
	forCol.r += backCol.r * 0.05;
		
	forCol.b += 0.5*mix(backCol.g, backCol.b, 0.8);
		
	
	
	gl_FragColor = forCol;
	*/

	
	
	
		vec4 forCol2 = vec4(v*.01,1.);
		backCol2 *= 0.2;
		backCol2.b *= 1.4;
	
		forCol2.r += backCol2.r * 0.05;
		
		forCol2.b += 0.5*mix(backCol2.g, backCol2.b, 0.8);
	

		gl_FragColor = forCol2;
	
	

	
 
}
