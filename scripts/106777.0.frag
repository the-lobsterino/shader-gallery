#extension GL_OES_standard_derivatives : enable

precision highp float;


uniform vec2 resolution;

void main( void ) {
	vec4 top = vec4(0.08, 0.753, 0.965, 1);
	vec4 bottom = vec4(0.192, 0.557, 0.278, 1.0);
	gl_FragColor = vec4(mix(bottom, top, (gl_FragCoord.y / resolution.y)));
}