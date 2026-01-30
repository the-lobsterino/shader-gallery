#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;

void main( void ) {
	vec2 p = surfacePosition*100.;
	gl_FragColor = vec4( 1.0 );
	
	//p = vec2(length(p), atan(p.y, p.x));
	
	#define rot2(T) mat2(cos(T), -sin(T), sin(T), cos(T))
	#define eval() if(max(abs(p.x), abs(p.y)) < 0.5){gl_FragColor = 1.-gl_FragColor/2.;}
	mat2 rm = rot2(radians(360.)*mouse.x);
	for(int i = 0;i<32;i+=1){
		eval();
		p -= vec2(1.5*sign(p.x),sign(p.y)*0.75)*mouse.y*5.;
		p *= rm;
		
	}
	

}