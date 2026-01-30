

// WORMHOLE - watch for a little while
// better, cleaner version.

#ifdef GL_ES
precision lowp float;
#endif
 
 
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


#define iterations 7
#define formuparam 0.79
 
#define volsteps 6
#define stepsize 0.230
 
#define zoom 0.800
#define tile  0.85

#define speed (-0.03 * cos((cos(0.02*time))))
// #define speed 0.0
 
//#define brightness (0.07 * (1.0 - 0.5*sus_sin(0.5*time)))
#define brightness (0.007 )

#define darkmatter 0.400
#define distfading 0.660
#define saturation 0.800


#define transverseSpeed zoom*.0005



#define cloud 0.3
#define pi 3.141592653589

//#define centralDamping pow(pow( pow(uvs.x*uvs.x,1.3) + pow(uvs.y*uvs.y,1.3), 1.0/(6.) ),1.5*((0.5 - 0.5*sus_sin(0.5*time))))
#define centralDamping 1.0



// an alternating periodic smoothstepping function
float sus_sin(float x)
{
	float x1 = x + (8.5*pi/2.0);
	float o1 = (clamp((1.0/(sin(pi/10.0))) * sin((1.0/5.0)*x1),-1.0,1.0));
	
	return max(abs(sin(x1)),abs(o1)) * sign(o1);
	
}






vec2 warp2(vec2 uvs)
{
	float a = abs(atan(uvs.y,uvs.x));
	float r = pow( pow(uvs.x*uvs.x,1.3) + pow(uvs.y*uvs.y,1.3), 1.0/(0.9 / length(uvs)) );
	
	
	return (0.5 + 0.5*sus_sin(0.5*time))*uvs  +  (0.5 - 0.5*sus_sin(0.5*time))*vec2((0.3/pow(r,1.)), (1.*a/3.1415927));
		
}

vec2 warp(vec2 uvs)
{
	
	//vec2 uvs = uv2-0.4*sin(0.7*time)*vec2(cos(0.4*time),-sin(0.4*time));
	
	
	float a = abs(atan(uvs.y,uvs.x));
	float r = pow( pow(uvs.x*uvs.x,1.3) + pow(uvs.y*uvs.y,1.3), 1.0/(6.) );
	
	
	return (0.5 + 0.5*sus_sin(0.5*time))*uvs  +  (0.5 - 0.5*sus_sin(0.5*time))*vec2((0.3/pow(r,1.)), (1.*a/3.1415927));
		
}

vec2 warp3(vec2 uvs)
{
	float a = abs(atan(uvs.y,uvs.x));
	float r = pow( pow(uvs.x*uvs.x,1.3) + pow(uvs.y*uvs.y,1.3), 1.0/(6.) );
	
	
	return (0.5 + 0.5*sus_sin(0.5*time))*uvs  +  (0.5 - 0.5*sus_sin(0.5*time))*vec2(uvs /pow(length(uvs),1.5));
		
}


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



highp float Rand(vec2 co)
{
    highp float a = 1552.9898;
    highp float b = 78.233;
    highp float c = 43758.5453;
    highp float dt= dot(co.xy ,vec2(a,b));
    highp float sn= mod(dt,3.14);
    return fract(sin(sn) * c);
}

float iAspectRatio = 2.0;

float Noise(vec2 UV, float Seed, vec2 Frequency){
	vec2 PerlinR = vec2(UV.x, UV.y) * vec2(Frequency);
	highp vec2 Perlin1Pos = vec2(floor(PerlinR.x), floor(PerlinR.y));
	
	float RandX0 = (Perlin1Pos.x+(Perlin1Pos.y)*Seed);
	float RandX1 = ((Perlin1Pos.x+1.0)+(Perlin1Pos.y)*Seed);
	float RandX2 = (Perlin1Pos.x+(Perlin1Pos.y+1.0)*Seed);
	float RandX3 = ((Perlin1Pos.x+1.0)+(Perlin1Pos.y+1.0)*Seed);
	
	float Perlin0Val = Rand(vec2(RandX0,RandX0*0.1224));
	float Perlin1Val = Rand(vec2(RandX1,RandX1*0.1224));
	float Perlin2Val = Rand(vec2(RandX2,RandX2*0.1224));
	float Perlin3Val = Rand(vec2(RandX3,RandX3*0.1224));
	
	vec2 Perc = (sin(((PerlinR - Perlin1Pos) * vec2(3.1415926)) - vec2(1.570796)) * vec2(0.5)) + vec2(0.5);
	
	float Val0to2 = (Perlin0Val*(1.0-Perc.y)) + (Perlin2Val*Perc.y); 
	float Val1to3 = (Perlin1Val*(1.0-Perc.y)) + (Perlin3Val*Perc.y); 
	
	return (Val0to2 * (1.0-Perc.x)) + (Val1to3 * Perc.x);	
}





float PerlinNoise1(vec2 UV, float Seed){
	float RetVal = 0.0;
	RetVal += Noise(UV, Seed * 1.2, vec2(2.0+ 1.2*cos(0.0*time))) * 0.5;
	RetVal += Noise(UV, Seed * 1.4, vec2(5.0+ 2.2*sin(0.0*time))) * 0.25;
	RetVal += Noise(UV, Seed * 1.1, vec2(10.0+ 2.2*cos(0.0*time))) * 0.125;
	RetVal += Noise(UV, Seed * 1.5, vec2(24.0- 2.2*cos(0.0*time))) * 0.0625;
	RetVal += Noise(UV, Seed * 1.2, vec2(54.0+ 2.2*sin(0.0*time))) * 0.03125;
	RetVal += Noise(UV, Seed * 1.3, vec2(128.0+ 2.2*cos(0.0*time))) * 0.025625;
	return RetVal;
}

float PerlinNoise2(vec2 UV, float Seed){
	float RetVal = 0.0;
	RetVal += Noise(UV, Seed * 1.2, vec2(6.0- 1.2*sin(0.0*time))) * 0.5;
	RetVal += Noise(UV, Seed * 1.4, vec2(12.0- 2.2*cos(0.0*time))) * 0.25;
	RetVal += Noise(UV, Seed * 1.1, vec2(24.0+ 2.2*cos(0.0*time))) * 0.125;
	RetVal += Noise(UV, Seed * 1.5, vec2(40.0- 2.2*cos(0.0*time))) * 0.0625;
	RetVal += Noise(UV, Seed * 1.2, vec2(80.0+ 2.2*cos(0.0*time))) * 0.03125;
	RetVal += Noise(UV, Seed * 1.3, vec2(158.0 + 2.2*cos(0.0*time))) * 0.025625;
	return RetVal;
}

vec3 field3(vec2 UV){
	
	
	vec2 TimeOffset = vec2(sin(time * 0.00962379), cos(time * 0.00962379)) * vec2(sin(time * 0.0041839) + 0.3);
	vec2 TempVec2A = TimeOffset;
	vec2 TempVec2B = vec2(0.0);
	vec2 TempVec2C = vec2(0.0);
	vec3 TempVec3A = vec3(0.0);
	
	TempVec2C.x = pow(1.0 - PerlinNoise1(UV, 21.32143 ), 3.5);
	TempVec3A = vec3(TempVec2C.x) * vec3(0.25, 0.67, 0.5);
	TempVec2C.x = pow(((1.0 - PerlinNoise2(UV + (TempVec2A * vec2(1.15)), 12.523)) * TempVec2C.x), 1.1);
	TempVec3A += vec3(TempVec2C.x) * vec3(1.0, 0.0, 0.0);
	
	vec3 RetVal = vec3(0,0,0);	
	TempVec2C.x = Rand(vec2(UV.x, UV.y));
	TempVec2C.y = Rand(vec2(UV.y, UV.x));
	highp float PowIn = ((sin(((time+10.0)*TempVec2C.x*1.7))*0.5)+0.5); 
	//RetVal.xyz = max(vec3(TempVec2C.x * pow(TempVec2C.y, 10.0) * pow(PowIn, 2.0) * 1.0), vec3(0.0)); 
	
	
	RetVal.xyz = TempVec3A;
	
	return RetVal;
}






void main()
{
   	
	float a_xz = 0.9;
	float a_yz = -.6;
	float a_xy = 0.9 + time*0.01;
	
	
	mat2 rot_xz = mat2(cos(a_xz),sin(a_xz),-sin(a_xz),cos(a_xz));
	
	mat2 rot_yz = mat2(cos(a_yz),sin(a_yz),-sin(a_yz),cos(a_yz));
		
	mat2 rot_xy = mat2(cos(a_xy),sin(a_xy),-sin(a_xy),cos(a_xy));
	
	
     	vec2 uv2 = 2. * gl_FragCoord.xy / resolution.xy - 1.;
	vec2 uvs = uv2 * resolution.xy / max(resolution.x, resolution.y);
	
	
	vec3 from=vec3(0.0, 0.0,0.0);
 	
	
	vec2 from_change = 1.0*vec2((mouse.x-0.5), (mouse.y-0.5));
	from_change *= +3.0*rot_xy;
	from.xy += from_change;

	
	
	uvs *= -2.0*rot_xy;

	// warp!
	
	
	//uvs = uvs-0.4*sin(0.7*time)*vec2(cos(0.4*time),-sin(0.4*time));
	
	
	//vec2 uv = warp(uvs);
	
	vec2 uv = (uvs);
	
	vec3 dir=vec3(uv*zoom,1.);
 
            

	vec3 forward = vec3(0.,0.,1.);
               
	
	from.y -= 20.0;
	from.x += transverseSpeed*(300.0)*(0.5 + 0.5*cos(0.2*time));
	
	vec3 from2 = from;
	
	
	from.z += 0.003*time;
	
	from2.z +=  0.009*time;
	
	
	
	dir.x += -transverseSpeed*(300.0)*(cos(0.3*time));
	
	
	dir.xy*= rot_xy;
	forward.xy *= rot_xy;

	dir.xz*=rot_xz;
	forward.xz *= rot_xz;
	
	dir.yz*= rot_yz;
	forward.yz *= rot_yz;
	 

	
	from.xy*=-rot_xy;
	from.xz*= rot_xz;
	from.yz*= rot_yz;
	 
	from2.xy*=-rot_xy;
	from2.xz*= rot_xz;
	from2.yz*= rot_yz;
	
	//zoom
	float zooom = (time-3311.)*speed;
	from += forward* zooom;
	from2 += forward* zooom;
	
	
	float sampleShift = mod( zooom, stepsize );
	 
	float zoffset = -sampleShift;
	sampleShift /= stepsize; // make from 0 to 1


	
	//volumetric rendering
	float s=0.24;
	float s3 = s + stepsize/2.0;
	vec3 v=vec3(0.);
	float t3 = 0.0;
	
	float t4 = 0.0;
	float v2 =1.0;
	

	
	vec3 backCol2 = vec3(0.);

	for (int r=0; r<volsteps; r++) {
		vec3 p2=from+(s+zoffset)*dir;
		vec3 p3=from2+(s3+zoffset)*dir;
		
		p2 = abs(vec3(tile)-mod(p2,vec3(tile*2.))); // tiling fold
		p3 = abs(vec3(tile)-mod(p3,vec3(tile*2.))); // tiling fold
		
		#ifdef cloud
		t3 = field(p3);
		t4 = Noise(2.1*(p3.yz*p3.xy),0.01,vec2(-1.9,2.1));
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
		a*=pow(a,2.); // add contrast
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
		

		//backCol2 += mix(.4, 1., v2) * vec3(1.8 * t3 * t3 * t3, 1.4 * t3 * t3, t3) * fade;

		//backCol2 += mix(.4, 1., v2) * vec3(1.8 * (t4) * t4 * t4, 1.4 * t4 * (t4), t4) * fade;

		
		backCol2 += field3(.2*forward.yz)*pow(fade,1.0)*pow(1.0*s1*a,(5.2)/a);
		
		
		s+=stepsize;
		s3 += stepsize;
		
		
		
	}
		       
	v=mix(vec3(length(v)),v,saturation); //color adjust
	 
	
	vec4 forCol2 = vec4(v*.01,1.);
	
	#ifdef cloud
	backCol2 *= cloud;
	#endif
	
	
	//backCol2.b *= 1.8;
	//backCol2.r *= 0.05;
	backCol2.b = 0.5*mix(backCol2.g, backCol2.b, 0.4);
	//backCol2.g = 0.0;
	backCol2.bg = mix(backCol2.gb, backCol2.bg, 0.5*(cos(time*0.01) + 1.0));
	
	vec4 newCol = (forCol2 + vec4(backCol2, 1.0)) * centralDamping;
	
	gl_FragColor = newCol;


	
 
}
