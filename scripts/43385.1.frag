#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

#define PI 3.1415

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.yy ) - vec2(0.5 * resolution.x/resolution.y, 0.5);
	vec3 col;
		
	float angle = mod((atan(position.y, position.x) + time * 0.2) / (2.0 * PI), 1.0);
	float dist = length(position);
	
	float f = angle * 4.0 + 0.1 * sin(dist * 32.0 - time * 2.0);
	f = mod(f, 1.0);
	float edge = smoothstep(0.49, 0.51, f);
	col = mix(vec3(0.2,0.4,0.5), vec3(0.7,0.4,0.2), edge);
	col *= 1.0 - dist * 0.3;
	float light = (1.0 - dist);
	col += edge * light * light;
	
	gl_FragColor = vec4(col, 1.0 );

}