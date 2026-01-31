#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;

// 円の距離関数
vec2 circle(vec2 p) {
	return vec2(length(p), .5);
}
// 正方形の距離関数
vec2 square(vec2 p){
	return vec2(abs(p.x) + abs(p.y), .7);
}
	
float a = sin(time * 5.) * .5 + .5;

void main() {

	vec2 p = surfacePosition;//(gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);

	vec2 d = mix(circle(p), square(p), ( a - .5 )*4.);  //ändrom3da4twist

	vec3 color = vec3(fract(d.y/d.x));//mix(vec3(1), vec3(0), step(d.x, d.y));

	gl_FragColor = vec4(color, 1.0);

}