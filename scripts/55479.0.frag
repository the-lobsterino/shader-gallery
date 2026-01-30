#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy ) + mouse / 4.0;

	float color = 0.0;
	color += sin( position.x * cos( time / 15.0 ) * 80.0 ) + cos( position.y * cos( time / 15.0 ) * 10.0 );
	color += sin( position.y * sin( time / 10.0 ) * 40.0 ) + cos( position.x * sin( time / 25.0 ) * 40.0 );
	color += sin( position.x * sin( time / 5.0 ) * 10.0 ) + sin( position.y * sin( time / 35.0 ) * 80.0 );
	color *= sin( time / 10.0 ) * 0.5;

	gl_FragColor = vec4( vec3( color, color * 0.5, sin( color + time / 3.0 ) * 0.75 ), 1.0 );
	

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

 

   
     	vec2 uv2 = 2. * gl_FragCoord.xy / resolution.xy - 1.;
	vec2 uvs = uv2 * resolution.xy / max(resolution.x, resolution.y);
	

	
	float time2 = time;
               
        float speed = speed2;
        speed = 0.005 * cos(time2*0.02 + 3.1415926/4.0);
          
	//speed = 0.0;

	
    	float formuparam = formuparam2;

	
    
	//get coords and direction

	vec2 uv = uvs;
	
	
		       
	//mouse rotation
	float a_xz = 0.9;
	float a_yz = -.6;
	float a_xy = 0.9 + time*0.04;
	
	
	mat2 rot_xz = mat2(cos(a_xz),sin(a_xz),-sin(a_xz),cos(a_xz));
	
	mat2 rot_yz = mat2(cos(a_yz),sin(a_yz),-sin(a_yz),cos(a_yz));
		
	mat2 rot_xy = mat2(cos(a_xy),sin(a_xy),-sin(a_xy),cos(a_xy));
	

	float v2 =1.0;
	
	vec3 dir=vec3(uv*zoom,1.);
 
	vec3 from=vec3(0.0, 0.0,0.0);
 
                               
        from.x -= .5*(-0.5);
        from.y -= .5*(-0.5);
               
               
	vec3 forward = vec3(0.,0.,1.);
               
	
	from.x += transverseSpeed*(1.0)*cos(0.01*time) + 0.001*time;
		from.y += transverseSpeed*(1.0)*sin(0.01*time) +0.001*time;
	
	from.z += 0.003*time;
	
	
	dir.xy*=rot_xy;
	forward.xy *= rot_xy;

	dir.xz*=rot_xz;
	forward.xz *= rot_xz;
		
	
	dir.yz*= rot_yz;
	forward.yz *= rot_yz;
	 

	
	from.xy*=-rot_xy;
	from.xz*=rot_xz;
	from.yz*= rot_yz;
	 
	
	//zoom
	float zooom = (time2-3311.)*speed;
	from += forward* zooom;
	float sampleShift = mod( zooom, stepsize );
	 
	float zoffset = -sampleShift;
	sampleShift /= stepsize; // make from 0 to 1


	
	//volumetric rendering
	float s=0.24;
	float s3 = s + stepsize/2.0;
	vec3 v=vec3(0.);
	float t3 = 0.0;
	
	
	vec3 backCol2 = vec3(0.);
	for (int r=0; r<volsteps; r++) {
		vec3 p2=from+(s+zoffset)*dir;// + vec3(0.,0.,zoffset);
		vec3 p3=(from+(s3+zoffset)*dir )* (1.9/zoom);// + vec3(0.,0.,zoffset);
		float pa,a=pa=0.;
		for (int i=0; i<iterations; i++) {
			p2=abs(p2)/dot(p2,p2)-formuparam; // the magic formula
			//p=abs(p)/max(dot(p,p),0.005)-formuparam; // another interesting way to reduce noise
			float D = abs(length(p2)-pa); // absolute sum of average change
			
			if (i > 2)
			{
			a += i > 7 ? min( 12., D) : D;
			}
				pa=length(p2);
		}
		
		
		//float dm=max(0.,darkmatter-a*a*.001); //dark matter
		a*=a*a; // add contrast
		//if (r>3) fade*=1.-dm; // dark matter, don't render near
		// brightens stuff up a bit
		float s1 = s+zoffset;
		// need closed form expression for this, now that we shift samples
		float fade = pow(distfading,max(0.,float(r)-sampleShift));
		
		
		//t3 += fade;
		
		v+=fade;
	       		//backCol2 -= fade;

		// fade out samples as they approach the camera
		if( r == 0 )
			fade *= (1. - (sampleShift));
		// fade in samples as they approach from the distance
		if( r == volsteps-1 )
			fade *= sampleShift;
		v+=vec3(s1,s1*s1,s1*s1*s1*s1)*a*brightness*fade; // coloring based on distance
		
		backCol2 += mix(.4, 1., v2) * vec3(0.20 * t3 * t3 * t3, 0.4 * t3 * t3, t3 * 0.7) * fade;

		
		s+=stepsize;
		s3 += stepsize;
		
		
		
		}
		       
	v=mix(vec3(length(v)),v,saturation); //color adjust
	 
	
	

	vec4 forCol2 = vec4(v*.01,1.);
	
	#ifdef cloud
	backCol2 *= cloud;
	#endif

}