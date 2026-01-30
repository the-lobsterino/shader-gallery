//From Mr Dylan shadertoy... Gigatron for glslsandbox ..
//  1.01 
#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
float angle=0.001;
void main()
{
	vec2 uv = (-1.+2.*gl_FragCoord.xy/resolution.xy)*vec2(resolution.x/resolution.y,1.)/1.0;
	vec4 scene = vec4(0.0);
	
	// parameters
	
	float blur = 0.04;	
	vec4 background = vec4(0,0,0,0);
	angle=sin(time/4.0);
	for(float i=0.;i<60.;i+=2.) {
		// animate
		vec2 lCenter,rCenter,mCenter,noise,bigcircle;
		lCenter.x = sin(angle+i*.5+time)*(.75);
		lCenter.y = sin(angle+i*.5+time)*(0.5)+cos(i*.5+time)*.2;
	
		rCenter.x = -1.*sin(angle+i*.5+time)*(.75);
		rCenter.y = sin(angle+i*.5+time)*(0.5)+cos(i*.5+time)*.2;
		
		mCenter.x = cos(time+i)*-.8;
		mCenter.y = sin(time+i)*0.8;
		
		
		
		float radius = 0.02;
		
		float distL = length(uv-lCenter);	
		float distR = length(uv-rCenter);	
		float distM = length(uv-mCenter);
		
		float bg = length(uv-noise);
		
		
		
		vec4 rightRing = vec4(1.,1.,.0,smoothstep(0.,blur,distR-radius*angle));	// Yellow
		vec4 leftRing = vec4(1.,.0,0.,smoothstep(0.,blur,distL-radius*angle));       // Red
		vec4 middleRing = vec4(.91,.4,.91,smoothstep(0.,blur,distM-radius));
		
		vec4 bgCircles = vec4(.0,.0,0.4+sin(angle/4.0),smoothstep(0.,0.2,bg-radius*angle));
		
		
		scene += mix(bgCircles, background,bgCircles.a);		
		scene += mix(rightRing,background,rightRing.a);
		scene += mix(leftRing,background,leftRing.a);
		scene += mix(middleRing,background,middleRing.a);
		
		
		scene.rgb = min(scene.rgb,vec3(1.0,1.0,1.));
		  
	}
	
	gl_FragColor =vec4(scene);	
}