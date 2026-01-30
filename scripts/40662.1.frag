#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float rand(vec2 co)
{
	return fract(sin(dot(co.xy,vec2(12.9898,78.233))) * 43758.5453);
}

void main( void ) {
	vec2 p = gl_FragCoord.xy / min(resolution.x, resolution.y);
	
	float v = rand(p + vec2(fract(time)));

	gl_FragColor = vec4(vec3(step(v, p.y)), 1.0 );

}