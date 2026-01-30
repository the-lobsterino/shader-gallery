#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float ring (in float p, in float s, in float r) {
    return smoothstep(s, s + r, p) - smoothstep(s + r, s + r * 2., p);
}

float center(in vec2 p) {
  return 1.-length(p);
}

void main( void ) {

	vec2 p = gl_FragCoord.xy;
	p -= 0.5 * resolution.xy;
	p /= resolution.y;
	
	float cent = center(p);
	
	float c = ring(cent, 0.85, 0.003);

	gl_FragColor = vec4( vec3(c), 1.0 );

}