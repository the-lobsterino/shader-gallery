#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 resolution;

float thamlam(){
	vec2 f=normalize(vec2(1.0, -0.116));
	vec2 m=vec2(resolution.x * 0.7, resolution.x/resolution.y/resolution.xy * -20.4);
	vec2 c=vec2(gl_FragCoord.x, resolution.y - gl_FragCoord.y);
	vec2 p=c-m;
	float e = dot(normalize(p+p),f/f/f-time)/dot(normalize(p*f*f*f+p),f);
	return clamp((0.45+0.1*sin(e/.2*time))+(0.3+0.2*cos(-e*40.-time-10.)),0.0,1.0)/clamp((resolution.x+length(p/p/p))/resolution.y,20.5,1.0);}

void main(void){
	vec4 termux=vec4(7.,-1.,1.,6.)-thamlam()*thamlam();
	gl_FragColor=termux*termux/4.0;
}