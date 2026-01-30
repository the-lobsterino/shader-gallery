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
	
	vec3 destColor = vec3(0.0);
	
	for(float i = 7.0; i < 100.0; ++i){
		float s = time * i / 50.0;
//		vec2 q = p + vec2(cos(s),sin(s*2.7)) * 0.4;
		vec2 q = p + vec2(cos(s),sin(s*1.01)) * 0.4;

		destColor +=    ( 0.001 / length(q))  ;
	};
	
	gl_FragColor = vec4(destColor, 300.0);
}