#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 resolution;

void main( void ) {

	float x = resolution.x / 2.0;
	float y = resolution.y / 2.0;
	float size = 5.0;
	vec2  pos = vec2(x, y);
	float dist = length(gl_FragCoord.xy - pos);
	float color = size / dist;
	gl_FragColor = vec4(vec3(color), 1.0);

}