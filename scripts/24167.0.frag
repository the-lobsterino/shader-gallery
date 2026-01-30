#ifdef GL_ES
precision mediump float;
#endif

// please always initialize variables, including gl_FragColor!! PS I'm going to puke from this

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	vec2 p = gl_FragCoord.yx - resolution.xy * 0.5;
	float t = 0.4 * time + length(p) / 170. * sin(time* 0.4);
	vec2 rot = vec2(sin(t) * p.x - cos(t) * p.y,
		 	tan(t) * p.x + cos(t) * p.y) / 40.;
	if (fract(rot.x) > .5 ^^ fract(rot.y) > .5) {
	gl_FragColor = vec4(0.7);
	} else {
	gl_FragColor = vec4(0.3);
	}
}