#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying  vec2 surfacePosition;
#define st sin(time/9.0)
#define ct cos(time/11.0)


mat2 rot (){
return mat2 (ct,-st,st,ct);}

void main( void ) {

	vec2 p = surfacePosition;
	vec2 uv = (2.0*gl_FragCoord.xy - resolution)/resolution.x;
    	float k = length(uv);
    	float theta = atan(uv.x, uv.y)/(cos(time-sin(k)));
	p = vec2(k, theta);
	vec3 color = vec3(0.0);

	float f = smoothstep(length(uv)-0.25,length(p)-0.01,0.15);
	float s = smoothstep(length(p)-0.5,length(p)-0.01,0.35);
	float e = smoothstep(length(uv)-0.125,length(uv)-0.01,0.25);
	p*=rot();
	float r;
		r =  sin(50.0*p.y + time-f);
		r += sin(e*p.x + time-f);
		r += sin(s*p.x*p.x + k*p.y*p.y);
		color.r = r;
	
	float t =sin(p.x+time/2.0);
		
	color = vec3(r*s,-r*f,r*-e+t);
	
	gl_FragColor = vec4( mix(vec3(0.5,0.0,0.5),(e*s*f)*color+color,0.1+.15*abs(st)),1.0);
}
