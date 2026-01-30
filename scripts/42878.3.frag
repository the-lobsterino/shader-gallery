#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;
uniform vec2 surfaceSize;

#define TRI(S)(  max(-2.*S.y, max(S.y-sqrt(3.)*S.x, S.y+sqrt(3.)*S.x))  )

void main( void ) {
	gl_FragColor = vec4( 1.0 );
	
	#define mult_TRI(S){  gl_FragColor = min(gl_FragColor, vec4( vec3( TRI(S) ), 1.0 ));  }
	#define ROT(T)( mat2(cos(T), sin(T), -sin(T), cos(T)) )
	const float N = 3.;
	vec2 _p = surfacePosition*4.*ROT(3.14159*.5);
	for(int i = 0; i <= int(N); i++){
		float w = float(i)*3.14159*2./N;
		vec2 position = _p*ROT(w)+0.333;
		mult_TRI(position);
	}
	
	
}