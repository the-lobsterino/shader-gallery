//From Mr Dylan shadertoy... Gigatron for glslsandbox ..

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main()
{
	vec2 uv = (-1.+2.*gl_FragCoord.xy/resolution.xy)*vec2(resolution.x/resolution.y,1.)/1.0;
	vec4 scene = vec4(0.0);
	
	// parameters
	float baseRadius = 0.02;
	float blur = 0.02;	
	vec4 background = vec4(0,0,0,0);

	for(float i=0.;i<150.;i++) {
		// animate
		vec2 lCenter,rCenter,mCenter,noise;
		lCenter.x = sin(.001+i*.5+time)*(.75);
		lCenter.y = sin(.001+i*.5+time)*(0.5)+cos(i*.5+time)*.2;
		rCenter.x = -1.*sin(.001+i*.5+time)*(.75);
		rCenter.y = sin(.001+i*.5+time)*(0.5)+cos(i*.5+time)*.2;
		mCenter.x = 0.-cos(time+i)*-.2;
		mCenter.y = sin(time+i)*(.8);
		
		float radius = baseRadius*4./4.+cos(i*.5+time)*baseRadius/4.;
		
		float distL = length(uv-lCenter);	
		float distR = length(uv-rCenter);	
		float distM = length(uv-mCenter);
		float bg = length(uv-noise);

		vec4 rightRing = vec4(1.,1.,.0,smoothstep(0.,blur,distR-radius));	// Yellow
		vec4 leftRing = vec4(1.,.0,0.,smoothstep(0.,blur,distL-radius));       // Red
		vec4 middleRing = vec4(.91,.4,.91,smoothstep(0.,blur,distM-radius));
		vec4 bgCircles = vec4(.0,.0,1.,smoothstep(0.,blur,bg-radius/2.));

		scene += mix(bgCircles, background,bgCircles.a);		
		scene += mix(rightRing,background,rightRing.a);
		scene += mix(leftRing,background,leftRing.a);
		scene += mix(middleRing,background,middleRing.a);
		scene.rgb = min(scene.rgb,vec3(1.0,1.0,1.));
		  
	}
	
	gl_FragColor =vec4(scene);	
}