#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;

#define zoom clamp(sin(time/5.00),0.20,0.40)*2.00
#define st (sin(time/2.00))
#define ct (cos(time/2.00))

mat2 rot(){
return mat2 (ct,-st,st,ct);
}


void main( void ) {

	vec2 p = surfacePosition*2.00*zoom*pow(2.0, time);
	vec3 color = vec3(0.00);
	
	float c  = smoothstep(0.20,0.75,length(p));   
	float c2 = smoothstep(0.20,0.21,length(p));   
	float c3 = smoothstep(length(p),1.78,1.20);   
	float c4 = smoothstep(length(p),1.20,1.00);
	
	p*=rot();
	float q,w;
	
	q = sqrt(sin(p.x*p.x + p.y*p.y));
	q+= sin(atan(p.x,p.y)* 8.00 + 3.00*q);
	
	p*=rot();

	w = sqrt(sin(p.x*p.x+p.y*p.y));
	w+= sin(atan(p.x,p.y)*18.00+10.00*q+0.50*q);
	
	color.r =  0.25+pow(q- w,   0.30);
	color.g =  0.50+pow(q*-w,   0.50);
	color.b =  0.25+pow(q* q,   0.25  +  (cos(time/4.00)));
	 
	gl_FragColor = vec4(c4*c3*c2*c*color,1.00);

}