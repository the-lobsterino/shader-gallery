


#ifdef GL_ES
precision lowp float;
#endif
 

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


#define iterations 4
#define formuparam 0.79
 
#define volsteps 4
#define stepsize 0.430
 
#define zoom 3.500
#define tile  0.85

//#define speed (-0.003 * cos((cos(0.02*time))))
#define speed (0.01)

#define brightness (0.007)


#define darkmatter 0.400
#define distfading 0.560
#define saturation 0.800


//#define transverseSpeed zoom*.005
#define transverseSpeed 0.0




#define cloud 0.0
#define pi 3.141592653589


#define centralDamping 1.0





float field(in vec3 p) {
	
	float strength = 17. + .03 * log(1.e-6 + fract(sin(time) * 4373.11));
	float accum = 0.;
	float prev = 0.;
	float tw = 0.;
	
	
	

	for (int i = 0; i < 3; ++i) {
		float mag = dot(p, p);
		p = abs(p) / mag + vec3(-.5, -.8 + 0.1*sin(time*0.7 + 2.0), -1.1+0.3*cos(time*0.3));
		float w = exp(-float(i) / 7.);
		accum += w * exp(-strength * pow(abs(mag - prev), 2.3));
		tw += w;
		prev = mag;
	}
	return max(0., 3. * accum / tw - .7);
}



vec3 space()
{
   	
	float a_xz = 1.9;
	float a_yz = -.6 + time*0.01;
	float a_xy = 0.9 - time*0.02;
	//float a_xy = 0.9;
	
	
	mat2 rot_xz = mat2(cos(a_xz),sin(a_xz),-sin(a_xz),cos(a_xz));
	
	mat2 rot_yz = mat2(cos(a_yz),sin(a_yz),-sin(a_yz),cos(a_yz));
		
	mat2 rot_xy = mat2(cos(a_xy),sin(a_xy),-sin(a_xy),cos(a_xy));
	
	
     	vec2 uv2 = 2. * gl_FragCoord.xy / resolution.xy - 1.;
	vec2 uvs = uv2 * resolution.xy / max(resolution.x, resolution.y);
	
	
	vec3 from=vec3(0.0, 0.0,0.0);
 	
	
	vec2 from_change = 1.0*vec2((mouse.x-0.5), (mouse.y-0.5));
	//from_change *= +3.0*rot_xy;
	from.xy += from_change;

	
	
	//uvs *= -3.0*rot_xy;

	// warp!
	
	
	//uvs = uvs-0.4*sin(0.7*time)*vec2(cos(0.4*time),-sin(0.4*time));
	
	

	vec2 uv = uvs;
	
	vec3 dir=vec3(uv*zoom,1.);
 
            

	vec3 forward = vec3(0.,0.,1.);
               
	
	//from.y -= 20.0;
	//from.x += transverseSpeed*(300.0)*(0.5 + 0.5*cos(0.2*time));
	
	from.z += 0.01*time;
	
	//dir.x += -transverseSpeed*(300.0)*(cos(0.3*time));
	
	
	dir.xy*= rot_xy;
	forward.xy *= rot_xy;

	dir.xz*=rot_xz;
	forward.xz *= rot_xz;
	
	dir.yz*= rot_yz;
	forward.yz *= rot_yz;
	 

	
	from.xy*=-rot_xy;
	from.xz*= rot_xz;
	from.yz*= rot_yz;
	 
	
	//zoom
	float zooom = (time-3311.)*speed;
	from += forward* zooom;
	float sampleShift = mod( zooom, stepsize );
	 
	float zoffset = -sampleShift;
	sampleShift /= stepsize; // make from 0 to 1


	
	//volumetric rendering
	float s=0.24;
	float s3 = s + stepsize/2.0;
	vec3 v=vec3(0.);
	float t3 = 0.0;
	float v2 =1.0;
	

	
	vec3 backCol2 = vec3(0.);

	for (int r=0; r<volsteps; r++) {
		vec3 p2=from+(s+zoffset)*dir;
		vec3 p3=from+(s3+zoffset)*dir*0.5;
		
		p2 = abs(vec3(tile)-mod(p2,vec3(tile*2.))); // tiling fold
		p3 = abs(vec3(tile)-mod(p3,vec3(tile*2.))); // tiling fold
		
		#ifdef cloud
		t3 = field(p3);
		#endif
		
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
		
		
		
		v+=fade;

		// fade out samples as they approach the camera
		if( r == 0 )
			fade *= (1. - (sampleShift));
		// fade in samples as they approach from the distance
		if( r == volsteps-1 )
			fade *= sampleShift;
		v+=vec3(s1,s1*s1,s1*s1*s1*s1)*a*brightness*fade; // coloring based on distance
		
		backCol2 += mix(.4, 1., v2) * vec3(1.8 * t3 * t3 * t3, 1.4 * t3 * t3, t3) * fade;

		
		s+=stepsize;
		s3 += stepsize;
		
		
		
	}
		       
	v=mix(vec3(length(v)),v,saturation); //color adjust
	 
	
	vec4 forCol2 = vec4(v*.01,1.);
	
	#ifdef cloud
	backCol2 *= cloud;
	#endif
	
	backCol2.b *= 1.8;
	backCol2.r *= 0.05;
	backCol2.b = 0.5*mix(backCol2.g, backCol2.b, 0.8);
	backCol2.g = 0.0;
	backCol2.bg = mix(backCol2.gb, backCol2.bg, 0.5*(cos(time*0.01) + 1.0));
	
	vec4 newCol = (forCol2 + vec4(backCol2, 1.0)) * centralDamping;
	
	return newCol.rgb;
	
	//gl_FragColor = newCol;


	
 
}



void main( void ) {

	vec2 position = 2.*(( gl_FragCoord.xy / resolution.xy )-0.5);
	position.x = position.x*resolution.x/resolution.y;
	float radius = 0.7;
	float z = sqrt(radius*radius - position.x*position.x - position.y*position.y);
	vec3 normal = normalize(vec3(position.x, position.y, (z)));
	
	// adjust lighting to mouse
	vec3 cLight = normalize(vec3((mouse.x-0.5)*2.0, (mouse.y-0.5)*2.0, 1.0));
	
	float diffuse = max(0., dot(normal, cLight));
	
	
	//antialias 
	float q = smoothstep(0.0,max(0.25,0.25 + 0.2*(1.0-radius)),normal.z*0.9);

	
	
	// fun w colours
	position.x += 1.3*time*radius;
	position.y += 0.5*time*radius;
	vec3 planet =  pow(diffuse*q,1.)*vec3(1.0*(z/radius) * (0.5+0.5*cos(cos((position.y/radius)*1.0) - sin((position.x/radius)*0.5))),0.4,(.2*pow((z/radius),-0.5)));	

	// add some stars
	planet = clamp(planet,vec3(0.0),planet);
	vec3 planetMask = vec3(step(0.0,z))*q;
	gl_FragColor = vec4(space()*(1.0-planetMask) + planet,1.0);
	
	
	
}