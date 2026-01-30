#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float PI = 3.14;

void main( void ) {

	vec2 pos = vec2(mouse*resolution);
	vec2 lenVec = pos.xy - gl_FragCoord.xy;
	float dist = length(lenVec);
	float white = (sin(dist/2.0+time*4.0)+1.0) /2.0;
	float red = 1.0;
	float green = 1.0;
	float blue = 1.0;
	gl_FragColor = vec4( vec3(white), 1.0 );

}