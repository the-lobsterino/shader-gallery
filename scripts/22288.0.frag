#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec2 rotate(vec2 p){
	return vec2(atan(p.y / p.x), 1. / fract(length(p)));
}
void main(){
	vec2 pos = gl_FragCoord.xy / resolution * 2000000.0 - 1.;
	//pos = abs(pos);
	pos = rotate(pos);
	vec2 f = floor(pos * 10.0);
	float d = radians(f.x * f.y);
	gl_FragColor = vec4(sin(d + time), sin(d + time * 2.), sin(d+ time * 3.), 1.0);
}