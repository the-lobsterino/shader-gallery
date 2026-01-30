#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;
float scale = 10.0;

vec2 multiply4x2 ( float z,vec2 chord){
	return chord * z;
}

void main( void ) {

	vec2 position = (mouse + surfacePosition + time / 10.0) * scale;
	
	float z = 5.0;
	
	vec2 project = multiply4x2(z,position);

	vec3 color = vec3(1, 0, 1) * ceil(sin(project.x)*sin(project.y));

	gl_FragColor = vec4( color, 1.0 );

}