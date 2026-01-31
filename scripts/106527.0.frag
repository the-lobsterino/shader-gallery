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
	for(float i = 30.; i < 124.; i++) {
		color += vec4(.347, .55, 5197., point(pos, vec2(.4 + sin(time + i) / 45., .55 + cos(time + i) / 4.)));
	}
	
	gl_FragColor = color / 102.;

}