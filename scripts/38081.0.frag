#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const float PI = 3.14;

void main( void ) {

	vec2 position = (2.0*gl_FragCoord.xy - resolution.xy)/resolution.xy;
	float intensity = 0.02/abs(length(position) - .32);
	vec3 color = vec3(intensity*.2, 0, intensity);
	
	for(float i = .0; i < 5.; i++) {
		vec2 q = position.xy + 0.2*vec2(cos(i*2.*PI/5. + time), sin(i*2.*PI/5. + time));
		float intensity = .01/abs(length(q) - (.1*abs(sin(time)) + .1));
		color += vec3(0, intensity, intensity*0.5);
	}
	
	gl_FragColor = vec4(vec3(color), 1.0);

}