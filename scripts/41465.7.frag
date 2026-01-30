#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;

void main( void ) {
	vec2 position2 = surfacePosition;
	
	
	const float pi = 3.14159;
	float color = 0.1;
	float color2 = 0.1;
	float radius = length(position2) ;
	
	
	position2.x  += sin(time) *0.05;
	position2.y += cos(time) *0.05;
	
	float d = atan(position2.x,position2.y)/pi ;
	float t = atan(position2.x,position2.y)/pi ;
	
	
	float d2 = atan(position2.x,position2.x)/pi  ;
	float t2 = atan(position2.x,position2.x)/pi  ;
	
	float d3 = atan(position2.y,position2.y)/pi;
	float t3 = atan(position2.x,position2.x)/pi;
	
	float c = 0.0;
	
	const float iterable = 20.0;
	
	const float iterable2 = 10.0;
	
	for(float i = 0.0;i<iterable;i++){
		
	color += 0.001/abs(0.1*cos(10.0*pi*(d3  + i/iterable*20.*time*.001)) - radius*(0.9+.75*cos(time)))/pi ;
	}
	
	for(float i = 0.0;i<iterable;i++){
		
	color += 0.001/abs(0.1*sin(2.0*pi*(d  + i/iterable*5.*time*0.03)) - radius*(0.3+0.1*sin(time))) ;
	c +=   color * sin(time) * radius * position2.x;
	}
	
	
	
	for(float i = -10.0;i<iterable2;i++){
		
	color2 += 0.0005/abs(0.1*sin(2.0*pi*(d2  + i/iterable*2.*time*0.05)) - radius*(0.3+0.1*sin(time))) ;
		
	}
		

	float colorDiv = (abs(d)  /abs(t) * sin(time))*3.;
	
	gl_FragColor = vec4( vec3( (color2  * color * sin(time)/colorDiv )   , (color/colorDiv * color2)   , color*sin(c) * t/t2   ) ,1.0 );
	
}