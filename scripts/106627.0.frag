#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float point(vec2 pos, vec2 pos2) {
	return 1. / distance(pos, pos2) / 10.;
}

void main( void ) {

	vec2 pos = ( gl_FragCoord.xy / resolution.xy );
	
	vec4 color = vec4(1.);
	for(float i = 0.; i < 100.; i++) {
		color += vec4(.2, .6, 4., point(pos, vec2(.5 + sin(time + i) / 4., .5 + cos(time + i) / 4.)));
	}
	
	gl_FragColor = color / 102.;

}