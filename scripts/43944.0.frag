// zinus 
// co3moz (Doğan Derya)
// https://gist.github.com/co3moz/cf6408b07352ec8e76dc

precision mediump float;
uniform float time;
uniform sampler2D backbuffer;
uniform vec2 resolution;

#define g(x1, y1) (texture2D(backbuffer, vec2(p.x + x1, p.y + y1)))
void main() {
	vec2 p = (gl_FragCoord.xy / resolution.xy);
	vec4 color = (g(0., 0.) + g(.005, -0.01) + g(.0025, 0.01) + g(.003, 0.0) + g(-.003, 0.0)) / 5.;	
	if(distance(p, vec2(.5, (1. + sin(time * 4.))/2.)) < .015) {
		color = vec4((3. + sin(time))/2. - 1., (3. + sin(time + 2.0943951))/2. - 1., (3. + sin(time + 4.1887902))/2. - 1., 1.);
	}
	gl_FragColor = color;
}