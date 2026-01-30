#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;

void main( void ) {
	vec2 s = surfacePosition;
	float d = dot(s,s);
	s/=d;
	float tt = 20.0;
	vec2 m = mouse * 2.0 - 7.9;
	vec2 i = floor(s.xy * tt);
	vec3 o = vec3(mod(i.x * i.y,1.0 + m.x*m.y));
	//o = fwidth(o);
	gl_FragColor = vec4(o,1.0);
}