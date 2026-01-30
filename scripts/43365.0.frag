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
	gl_FragColor = vec4( .10 );
	
	#define mult_TRI(S){  gl_FragColor *= vec4( vec3( TRI(S) ), 1.0 );  }
	
	vec2 position = surfacePosition*2.;
	mult_TRI(position);
	//return;
	for(int i = 0; i <= 2; i++){
		mult_TRI(position);
		position *= (1.+(-0.5+mouse.x)*10.*dot(position, position));	
		float w = mouse.y;
		position += vec2(sin(w), cos(w))*cos(time+dot(position, position));
	}
	
	
}