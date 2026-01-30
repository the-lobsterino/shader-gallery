#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;

float funk(float x, float y){
	return 1./(x-y);
}
vec2 funk2(vec2 a){
	return vec2(funk(a.x,a.y), funk(a.y,a.x));
}
void main( void ) {
	
	vec2 p = ( gl_FragCoord.xy / resolution.xy );
	vec2 P = surfacePosition;
	
	float color = fract(length(funk2(pow(vec2(2.), P))));
	
	
	gl_FragColor = vec4( vec3( color ), 1.0 );

}