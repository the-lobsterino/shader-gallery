#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


#define LUM 150.


void main( void) {
	vec3 flag_color = vec3(0.);
	if( gl_FragCoord.x < resolution.x*(1./3.)) {
		flag_color = vec3(0.,0.,1.);
	} else if (gl_FragCoord.x > resolution.x*(1./3.) && gl_FragCoord.x < resolution.x * (2./3.)) {
		flag_color = vec3(1.);
	} else {
		flag_color = vec3(1.,0.,0.);
	}
	
	float dist = length((0.5*resolution.xy) - gl_FragCoord.xy);
	flag_color *= 1./dist * LUM;
	flag_color = 1.-exp(-flag_color);
	gl_FragColor = vec4(flag_color, 1.);
}