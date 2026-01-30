// SPUNK BUBBLE MADE IN CAMBRIDGE BY SOME CUNT
// lol he said cunt
#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float distanceFunction(vec2 pos) {
	float a = atan(pos.x/pos.y);
	float f = 10.;
	float squiggle = sin( time+pos.x*16.0+f * a) *0.14;
	squiggle*=sin(time*2.37+a*18.0)*3.5;
	return length(pos) - .005 - squiggle*squiggle;
}

void main( void ) {
	vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);

	p.xy *= dot(p,p);
	
	vec3 col = vec3(0.56,0.34,.5) * distanceFunction(p);
	
	float v1 = sin(time*6.0)*0.015;
	
	col = vec3(0.9)-smoothstep(0.01+v1, .41, col);


	gl_FragColor = vec4(smoothstep(0.5, 1.75, col*col) * 6., 1.0);
}
