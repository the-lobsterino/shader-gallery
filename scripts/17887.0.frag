#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define PI 3.1416

void main( void ) {

	vec2 m = clamp(mouse,0.1,1.0);
	
	vec2 p = gl_FragCoord.xy/resolution.xy;
	vec2 q = (2.*p - 1.);
	q.x *= resolution.x/resolution.y;
	
	
	float f=atan(q.x,q.y);
	float g = f+ 11.0*sin(time*0.5);
	float h = f+ 23.0*cos(time*0.5);
	
	float b = mod(length(q)+g*m.x*1./PI,m.x)/m.x;
	
	float c = mod(length(q)+h*m.y*1./PI,m.y)/m.y;
	
	b = (b > 0.8) ? 0.5:0.0;
	c= (c >0.1) ? 0.5:0.0;
	
	gl_FragColor = vec4(vec3(b+c*0.5,c+b*0.5,0.2),1.);

}