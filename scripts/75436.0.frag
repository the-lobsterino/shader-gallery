#extension GL_OES_standard_derivatives : enable

#define PI 3.1415926538

precision mediump float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 pos = ( gl_FragCoord.xy - resolution / 2.0) / resolution.y;
	
	float angle = acos(normalize(pos).y) * sign(pos.x) / PI - time / 4.0;
	float intensity = 1.0 - mod(length(pos) * 10.0 + angle, 1.0);
	
	vec3 col = mix(vec3(1.0,0.0,0.0), vec3(0.0,0.0,1.0), length(pos));
	
	gl_FragColor = vec4( col * intensity,1.0 );
}