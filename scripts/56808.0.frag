#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform sampler2D backbuffer;
uniform vec2 resolution;


//Formula found here: https://yalantis.com/blog/how-we-created-visualization-for-horizon-our-open-source-library-for-sound-visualization/
vec2 b3_mix(vec2 p0,vec2 p1,vec2 p2,vec2 p3,float t)
{
	vec2 p01 = mix(p0,p1,t);
	vec2 p12 = mix(p1,p2,t);
	vec2 p23 = mix(p2,p3,t);
	vec2 c1 = mix(p01,p12,t);
	vec2 c2 = mix(p12,p23,t);
	return mix(c1,c2,t);
}

vec3 draw(vec3 base, vec3 paint, float thick, float smooth, float dist)
{
	return mix(base,paint,1.-smoothstep(thick,thick+smooth,abs(dist)));
}

void main( void ) {

	
	vec2 uv = gl_FragCoord.xy/min(resolution.x,resolution.y);
	float pixel = 1./min(resolution.x,resolution.y);
	vec2 scale = resolution/min(resolution.x,resolution.y);
	
	vec2 	p0 = vec2(0.2,0.2),
		p1 = vec2(0.1,0.75),
		p2 = vec2(1.5,0.25),
		p3 = vec2(1.2,0.5);
	
	p3 = mouse.xy*scale;
	
	float timing = time/8.;
	float t = mod(timing,1.);
	float dir = step(1.,mod(timing,2.));
	t = mix(t,1.-t,dir);
	vec2 spline = b3_mix(p0,p1,p2,p3,t);
	
	vec3 cPrev = texture2D(backbuffer, gl_FragCoord.xy / resolution).xyz;
	vec3 color = cPrev - vec3(0.1,0.025,0.025);
	float blend = 0.1;
	
	
	color = draw(color,vec3(1.,0.,0.),10.*pixel,2.*pixel,distance(p0,uv));
	color = draw(color,vec3(1.,0.,0.),5.*pixel,2.*pixel,distance(p1,uv));
	color = draw(color,vec3(1.,0.,0.),5.*pixel,2.*pixel,distance(p2,uv));
	color = draw(color,vec3(1.,0.,0.),10.*pixel,2.*pixel,distance(p3,uv));
	
	
	color = draw(color,vec3(1.),10.*pixel,5.*pixel,distance(uv,spline));
	color = mix(cPrev,color,blend);
	color = draw(color,vec3(1.),5.*pixel,2.*pixel,distance(uv,spline));
	
	
	gl_FragColor = vec4(color , 1.0 );

}