#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float hash(float x)
{
	x *= 1234.56789;
	return fract(x*fract(x));
}

void main( void ) {

	vec2 uv = gl_FragCoord.xy / resolution.xy;

	float h = hash(uv.x+hash(uv.y)+fract(time));
	
	gl_FragColor = vec4(h);
}