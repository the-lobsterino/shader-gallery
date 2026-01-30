#ifdef GL_ES
precision highp float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;

uniform vec2 resolution;

void main( void ) {

	vec2 uv = ( gl_FragCoord.xy / resolution.xx );
	vec2 c1 = vec2(0.4 + sin(time * 1.3) * 0.1, 0.2 + cos(time * 1.2) * 0.1);
	vec2 d1 = uv - c1;
	
	vec2 c2 = vec2(0.7 + sin(time) * 0.2, 0.3 + cos(time) * 0.3);
	vec2 d2 = uv - c2;
	
	float m1 = mod(length(d1) * 50.0 + time, 1.0);
	float m2 = mod(length(d2) * 50.0 - time, 1.0);
	
	
	float s1 = smoothstep(0.45, 0.55, m1);
	float s2 = smoothstep(0.45, 0.55, m2);
	
	gl_FragColor = vec4(vec3(s1, s2, 0.0), 1.0 );

}