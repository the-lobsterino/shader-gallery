#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform vec2 surfaceSize;
varying vec2 surfacePosition;

void main( void ) {

	vec2 uv = (surfacePosition - ((mouse-0.5)*surfaceSize));
	
	float duv = dot(uv,uv);
	
	float v = smoothstep(0.5,1./resolution.x,duv*2.0);
	
	v *= v * v + v;
	
	gl_FragColor = vec4( vec3(v), 1.0 );

}
