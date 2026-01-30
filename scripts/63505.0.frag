#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main(){
	vec2 p = (gl_FragCoord.xy - resolution.xy / 2.) / resolution.y;
	float angle = atan(p.y, p.x), radius=length(p) * (1. + sin(angle * 2. + time) * .1);
	gl_FragColor = vec4(vec3(.5 + .5*cos(angle * vec3(1., 2., 3.))) * (.03 + .02 * sin(time + angle)) / abs(radius - .4), 1.);
}
