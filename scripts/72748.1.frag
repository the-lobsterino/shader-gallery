#ifdef GL_ES
precision highp float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	float ratio = resolution.x / resolution.y;
	vec2 uvN = (gl_FragCoord.xy / resolution.xy) * 2.0 - 1.0;
	uvN.x *= ratio;

	vec2 center = vec2(0.0);
	float d1 = distance(uvN, center);
	float a1 = 1.0 - smoothstep(0.89, 0.9, d1);
	
	
	vec2 center2 = vec2(1.25 + (sin(time)*0.35+0.25),0.0);
	float d2 = distance(uvN, center2);
	float a2 = smoothstep(0.89, 0.9, d2);
	

	gl_FragColor = vec4(vec3(1.0)*a1*a2, 1.0 );

}