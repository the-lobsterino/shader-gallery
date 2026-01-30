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
	float radius = length(position2) *9.0;
	
	float d = atan(position2.x,position2.y)/pi ;
	
	const float iterable = 20.0;
	
	for(float i = 0.0;i<iterable;i++){
		
	color += 0.0009/abs(0.1*sin(3.0*pi*(d + i/iterable*10.*time*0.03)) - radius*(0.001 +0.1*sin(time))) ;
		
	}
	

	gl_FragColor = vec4( vec3( color * sin(time)  , color , color  ), 1.0 );

}