#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 center = vec2(200.,150.);
	vec2 position = gl_FragCoord.xy-center;
	float distance = length(position);
	float radius = 100.;
	float height = sqrt(radius*radius-distance*distance);
	vec3 position3 = vec3(position, height);
	vec3 source = vec3(1000,1000,2000);
	vec3 light = normalize(source-position3);
	vec3 ref = reflect(light, normalize(position3));
	vec3 camera = vec3(0,0,-1);
	float intensity = smoothstep(0.9,1.,clamp(dot(ref, camera),0.,1.));
	

	gl_FragColor = vec4( intensity, intensity, intensity,1.0);
}