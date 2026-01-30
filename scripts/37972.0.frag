#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;

#define st (sin(time))
#define zoom clamp(sin(time/15.0),0.07,0.12) * 5.0
#define leftright clamp(cos(time/15.0),0.0,0.8) * 35.0

void main( void ) {

	vec2 p = surfacePosition*19.0;

	float w,q;
	vec3 color = vec3(0.0);
	
	p*=  zoom;
	p.x+=leftright;
	
	
	q+= sin(p.x + time);
	q+= sin(p.y + time*2.0);
	q+= sin(p.x + p.y + time);
	q+= step(sin(sqrt(p.y*p.y+p.x*p.x) - time/1.00),0.9*st);
	
	w+= sin(p.y+p.y + time/2.);
	w+= step(sin(sqrt(p.y*p.y+p.x*p.x) - time/2.00),-0.5);
	
	for (float i =1.0; i < 3.0; i+=0.51){
	w*= (sin(sqrt(p.y*p.y+p.x*p.x) + time*.1*(i/.5)));	
	}
	
	color.r = (q + w);
	color.g = (w);
	color.b = (-q)*st;

	vec3 colorqw = mix(vec3(q),vec3(w),0.75);

	gl_FragColor = vec4( mix(color, colorqw, 0.5), 1.0 );

}