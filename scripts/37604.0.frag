#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;
# define ST sin(time) // not used

void main( void ) {

	vec2  p = surfacePosition;
	float q,w,e;
	vec3  color = vec3(0.0);
	float v,xc,yc;
		
	w=0.5;
	q=mod(5.2*p.x+time/100.0,0.06)*7.0;
	w=mod(5.2*p.y+time/100.0,0.06)*7.0;
	color = mix (color, vec3(q,w,q+w), 1.00);
	
	for(float t=-1.0; t<1.0; t+=0.02){ 
	if(p.y<0.002+t&&p.y-t>-0.002) 
		color=vec3(0.0,0.0,0.0);
	}
	
	for(float t=-1.0; t<1.0; t+=0.02){
	if(p.x<0.002+t&&p.x-t>-0.002)
		color=vec3(0.0,0.0,0.0);
	}
	
	xc=0.2*sin(time);
	yc=0.3*cos(time/4.0);
	for(float i=0.0; i<1.0; i+=0.300)
	v+=0.00235/length(p-vec2(
		xc+i*0.050*sin(time),
		yc+i*0.050*cos(time)));
	v*=pow(v,75.0);
	
	gl_FragColor = vec4( color+v, 1.0 );
}













