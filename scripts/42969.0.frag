#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;

#define TRI(S)(  max(-2.*S.y, max(S.y-sqrt(3.)*S.x, S.y+sqrt(3.)*S.x))  )

void main( void ) {
	gl_FragColor = vec4( 1.0 );
	
	#define mult_TRI(S){  gl_FragColor *= vec4( vec3( TRI(S) ), 1.0 );  }
	
	vec2 position = surfacePosition*2.+0.25;
	mult_TRI(position);
	//return;
	for(int i = 0; i <= 8; i++){
		mult_TRI(position);
		float w = 3.14/3.;
		position -= .3*vec2(sin(w), cos(w))*cos(dot(position, position));
		float t = cos((1.+time*0.3+2.*sqrt(time))*(1.+float(i)/7.))*0.0008*(0.125+25.*float(i));
		position *= mat2(cos(t), sin(t), -sin(t), cos(t));
	}
	
	
}