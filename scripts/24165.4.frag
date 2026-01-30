#ifdef GL_ES
precision mediump float;
#endif

// please always initialize variables, including gl_FragColor!! PS I'm going to puke from this
// Ok thanks man !...
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	vec2 p = gl_FragCoord.xy - resolution.xy * 0.5;
	float t = time + length(p) / 1700. * time *mouse.x*mouse.y/300.;
	vec2 rot = vec2(cos(t) * p.x - sin(t) * p.y,
		 	cos(t) * p.y + sin(t) * p.x) / 0.2*cos(t*3.0)/500.0;
	if (fract(rot.x) > .5 ^^ fract(rot.y) > .5) {
	gl_FragColor = vec4(1.0);
	} else {
	gl_FragColor = vec4(1.0,0.0,0.0,1.0);
	}
}