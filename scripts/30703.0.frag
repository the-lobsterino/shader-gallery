// co3moz

precision mediump float;
uniform float time;
uniform vec2 resolution;
uniform sampler2D buffer;

#define g(a,b) (texture2D(buffer, vec2(position.x + a, position.y + b)))
#define rainbow (vec4((3. + sin(time))/2. - 1., (3. + sin(time + 2.0943951))/2. - 1., (3. + sin(time + 4.1887902))/2. - 1., 1.))

void main() {
	vec2 position = ( gl_FragCoord.xy / resolution.xy );
	vec4 color = (g(0.0, 0.0) + g(0.01, 0.01 + sin(time*3.)/200.))/2.;
	vec2 mark = vec2(0.7 + sin(time)/10., 0.8 + cos(time*5.)/10.);
	if(distance(mark, position) < 0.025) color = rainbow;
	gl_FragColor = color;
}