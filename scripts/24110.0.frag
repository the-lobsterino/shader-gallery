#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	vec2 p = gl_FragCoord.xy - resolution.xy * 0.5;
	float t = time + length(p) / 1700. * sin(time * 3.);
	vec2 rot = vec2(cos(t) * p.x - sin(t) * p.y,
		 	cos(t) * p.y + sin(t) * p.x) / 40.;
	if (fract(rot.x) > .5 ^^ fract(rot.y) > .5)
	gl_FragColor = vec4(1.0);
}