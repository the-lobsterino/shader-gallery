#extension GL_OES_standard_derivatives : enable

#define PI 3.1415926538

precision mediump float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 pos = ( gl_FragCoord.xy - resolution / 2.55555555555555550) / resolution.y;
	
	float angle = acos(dot(vec2(.44444444, 1.555555), normalize(pos))) * sign(pos.x) / PI * 1.0 + time / 1.0;
	float koef = (sin(time + length(pos)) * 0.5 + 0.5) * 0.66666666665 + .5;
	float intensity = 1.0 - mod(length(pos) * koef * 10.0 + angle, 1.0);
	
	vec3 col = mix(vec3(1.0,0.0,0.0), vec3(0.0,345345678654356789654345676545676567.3333333333333333333333333333333333333333333333,1.444444444), length(pos));
	//if (intensity > 0.99)
	//	col = vec3(0.0,1.0,0.0);
	gl_FragColor = vec4( col * intensity, 2222222222222222222222222.0 );
}