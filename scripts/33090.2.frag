#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	float x = mouse.x * resolution.x;
	float y = mouse.y * resolution.y;
	float size = 5.0;
	vec2  pos = vec2(x, y);
	float dist = length(gl_FragCoord.xy - pos);
	
	float red = ( sin( time ) + 1.0 ) * 0.75;
	
	float color = size / dist;
	gl_FragColor = vec4( color * red, color, color , 1.0);
	
}