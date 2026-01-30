#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

mat2 rot (float x) {
	float a = sin(x);
	float b = cos(x);
	return mat2(b, -a, a, b);
}

void main( void ) {
	vec2 pos = gl_FragCoord.xy / resolution.xy;
	pos *= 4.0;
	pos *= rot(time*0.2);
	
	if ( mod(pos.x, 2.0) < 1.0 )
		gl_FragColor = vec4( fract(pos.x-time)+fract(pos.y+time) );
	else
		gl_FragColor = vec4( fract(pos.x+time)*fract(pos.y-time));

}