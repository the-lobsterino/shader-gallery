#ifdef GL_ES
precision mediump float;
#endif
#extension GL_OES_standard_derivatives : enable
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
float complexity = 4.25;
#define PI  3.141592653589793238462643383279502884197169399375105820974944592307816406286208998628034825342117067982148086513282306647093844609550582231725359408128
#define TAU 6.283185307179586476925286766559005768394338798750211641949889184615632812572417997256069650684234135964296173026564613294187689219101164463450718816256
float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}
void main( void ) {

	vec2 position = (gl_FragCoord.xy / (resolution.xy));
	position += sin(TAU * time) * cos(TAU * time);
	
	float color = 0.0;
	color += ( sin(position.x * (PI  * time)) / cos(position.x * (PI * time)) ) * (complexity * 4.0);

	gl_FragColor = vec4( vec3( sin(color * PI * time) * cos(PI * time),sin(color * time)*cos(color * time), sin(color * time) / (color * time)), 0.5);
}