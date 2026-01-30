#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float random (vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

void main( void ) {

	vec2 relPos = (gl_FragCoord.xy - (mouse * resolution)) / 10.0;
	vec2 wot = cos(relPos) + cos(2.4 * relPos) + cos(3.2 * relPos);
	float adjRand = 1.0 - 0.4 * random(relPos);
	
	float b = .5 + .25 * (wot.x * adjRand + wot.y * adjRand);
	gl_FragColor = vec4(b, b, b, 1);

}