
#ifdef GL_ES
precision mediump float;
#endif


#define iterations 4
#define formuparam2 0.89
 
#define volsteps 10
#define stepsize 0.190
 
#define zoom 3.900
#define tile   0.450
#define speed2  0.010
 
#define brightness 0.2
#define darkmatter 0.400
#define distfading 0.560
#define saturation 0.400


#define transverseSpeed 1.1
#define cloud 0.2

 
float triangle(float x, float a) {
	float output2 = 2.0 * abs(3.0 * ((x / a) - floor((x / a) + 0.5))) - 1.0;
	return output2;
}
 

float field(in vec3 p) {
	
	float accum = 0.;
	float prev = 0.;
	float tw = 0.;
	

	for (int i = 0; i < 6; ++i) {
		float mag = dot(p, p);
		
		float w = exp(-float(i) / 7.);
		
		tw += w;
		prev = mag;
	}
	return max(0., 5. * accum / tw - .7);
}



void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
   
     
               
        float speed = speed2;
        
    	float formuparam = formuparam2;
	//get coords and direction
	
	//mouse rotation
	float a_xz = 0.9;
	float a_yz = -.6;
	
	
	mat2 rot_xz = mat2(cos(a_xz),sin(a_xz),-sin(a_xz),cos(a_xz));
	
	mat2 rot_yz = mat2(cos(a_yz),sin(a_yz),-sin(a_yz),cos(a_yz));

	

	float v2 =1.0;
	
	
 
	vec3 from=vec3(0.0, 0.0,0.0);
 
                               
        from.x -= 5.0* (0.5);
        from.y -= 5.0* (0.5);
               
               
	vec3 forward = vec3(0.,0.,1.);
               
	

	forward.xz *= rot_xz;
		
	
	forward.yz *= rot_yz;
	 

	
	
	from.xz*=rot_xz;
	from.yz*= rot_yz;
	 
	//volumetric rendering
	float s=0.24;
	float s3 = s + stepsize/2.0;
	vec3 v=vec3(0.);
	float t3 = 0.0;
	
	
	vec3 backCol2 = vec3(0.);
	for (int r=0; r<volsteps; r++) {
		
		
		#ifdef cloud
		#endif
		
		float pa,a=pa=0.;
		for (int i=0; i<iterations; i++) {
			
			//p=abs(p)/max(dot(p,p),0.005)-formuparam; // another interesting way to reduce noise
			
			if (i > 2)
			{
			
			}
				
		}
		
		
		//float dm=max(0.,darkmatter-a*a*.001); //dark matter
		a*=a*a; // add contrast
		//if (r>3) fade*=1.-dm; // dark matter, don't render near
		// brightens stuff up a bit
		// need closed form expression for this, now that we shift samples
		
		
		
		//t3 += fade;
		
	
	       		//backCol2 -= fade;

		// fade out samples as they approach the camera
		if( r == 0 )
			
		// fade in samples as they approach from the distance
		if( r == volsteps-1 )
		
		s+=stepsize;
		s3 += stepsize;
		
		}
		       
	v=mix(vec3(length(v)),v,saturation);
	vec4 forCol2 = vec4(v*.01,1.);
	
	#ifdef cloud
	backCol2 *= cloud;
	#endif
    
	fragColor = forCol2 + vec4(backCol2, 1.0);
}


/*void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
	vec2 uv = fragCoord.xy / iResolution.xy;
	fragColor = vec4(uv,0.5+0.5*sin(iTime),1.0);
}*/