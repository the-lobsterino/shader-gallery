#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy );// + mouse * 1.0;
	float X = position.x*64.0;
	float Y = position.y*64.0;
	float t = time/3.0;
	float o = cos(t-X/4.0)+sin(t+X/9.0+sin(Y/(4.0+sin(t/4.0)-sin(X/Y))));
	gl_FragColor = vec4( vec3( o, o*sin(Y+t*9.0+sin(X+t)), -o), 1.0 );

}
