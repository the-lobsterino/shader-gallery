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
	
	vec2 _p = surfacePosition*4.;
	//mult_TRI(position); return;
	for(int i = 0; i <= 32; i++){
		float w = float(i)*3.14159;
		vec2 position = (_p+.5)*(1.+sqrt(w)*0.2) - vec2(w)*vec2(.1,.055);
		float x = cos(dot(_p, _p+_p.x)*0.07+time+sin(time*1.23 + 1.0*cos(sqrt(time)/10.)))*0.02;
		_p.y += x;
		_p.x += x;
		_p *= ROT(x);
		mult_TRI(position);
	}
	
	
}