#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = (gl_FragCoord.xy / resolution.xy)*100.;

	float r = 0.0;
	float g = 0.0;
	float b = 0.0;
	float x = 0.;
	for(int i = 0; i < 25; i++) {
		x += float(i)*float(i)/125.;
		r += sin(x)*1.62/length(position-vec2(x-g*50.,50.*g*b*sin(time)+50.));
		g += cos(x)*1.62/length(position-vec2(x-r*50.,50.*r*b*cos(time)+50.));
		b += tan(x)*1.62/length(position-vec2(x+b*50.,50.*b*sin(time)+50.));
	}

	gl_FragColor = vec4(r, g, b, 1.0);

}