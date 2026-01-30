#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float sphere_sdf(vec3 p) {
	return 0.0;
}

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy );

	gl_FragColor = vec4(position, 0.0, 1.0);

}