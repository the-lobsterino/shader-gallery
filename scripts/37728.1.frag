#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;

void main( void ) {

	vec2 p = surfacePosition;
	float t,g,w,line,color = 0.0;
	t = time;
	 
	p.x = abs(p.x)-0.5;
	p.y = abs(p.y)-0.5;
	
	for (float i=0.0; i<0.25; i+=0.01){
		t+= i*.4;
		g +=     step(length(p-vec2(1.0*sin(t*0.6),
		         0.135+0.30*abs(sin(-t*2.0)))),0.008+0.01);
		g +=     step(length(p-vec2(1.0*sin(-t*0.6),
		         0.135+0.30*abs(sin(-t*2.0)))),0.008+0.01);
		g +=     step(length(p+vec2(1.0*sin(t*0.6),
		         0.135+0.30*abs(sin(-t*2.0)))),0.008+0.01);
		 g +=     step(length(p+vec2(1.0*sin(-t*0.6),
		         0.135+0.30*abs(sin(-t*2.0)))),0.008+0.01);
		
		 g  +=     step(length(p*vec2(0.5*sin(t),
		         0.135+0.30*abs(sin(-t*2.0)))),0.008+0.01);
		 
	}
	
	if ((p.y<0.12) ^^ (p.y<0.13)) line =1.0;
	if ((p.y<-0.12) ^^ (p.y<-0.13)) line =1.0;
	
	gl_FragColor = vec4( vec3(g*p.x*p.y, line+g*p.y , line+g*p.x), 1.0 );
}


















