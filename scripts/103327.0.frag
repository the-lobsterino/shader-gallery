#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float random(vec2 st) {
     return fract(sin(dot(st.xy, vec2(12.9898, 78.233)))* 43758.5453);
}
float random1(float d){
	return fract(sin(d)*43758.5453);
}

void main( void ) {
	float cPosition = gl_FragCoord.x*0.05;
	float c = floor(cPosition); //  获取整数部分, 前一个值
	float d = fract(cPosition); //  获取小数部分, 混合比例
	float before = random1(c); // 前面一个像素的值
	float after = random1(c+1.0); // 后面一个像素的值
	float streegth = mix(before, after, d);
	float streegths = mix(1.0,3.0,0.5);
	float cc = random1(gl_FragCoord.x*0.0000005);
	gl_FragColor = vec4(cc, cc, cc,1.0);
}