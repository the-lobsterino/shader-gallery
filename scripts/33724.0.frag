#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;

void main( void ) {
	vec2 p =  surfacePosition * 2.0;
	p -= vec2(0.5, 0.0);
	
	int j = 0;
	vec2 z = p;
	//vec2 c = p;
	vec2 c = vec2(0.333, 0.4) ;
	
	for(int i = 0; i <360; i++){
		j++;
		if(length(z) > 2.0) break;
		z = vec2(z.x * z.x - z.y * z.y, 2.0 * z.x * z.y) + c;
	}
	
	
	gl_FragColor = vec4(vec3(float(j) / 360.0), 1.0);
}