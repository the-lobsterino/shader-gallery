#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 resolution;

float w = resolution.x/2.0;
float h = resolution.y/2.0;
float PI = 3.141592653589793;

void main( void ) {
	float move = w / 2.0;
	
	vec2 pos1 = vec2(w + move * ( sin(time)), h);
	vec2 pos2 = vec2(w, h);
	vec2 pos3 = vec2( w + move * ( sin(time)),h + move * ( cos(time)));
	
	float dist1 = length(gl_FragCoord.xy - pos1);
	float dist2 = length(gl_FragCoord.xy - pos2);
	float dist3 = length(gl_FragCoord.xy - pos3);

	
	// 円のサイズ
	float size = 25.0;
	
	// distがsize以下であれば累乗根で潰す。
	// この値が大きければsize以上離れている場所は0に近づくのでポワッとしなくなる
	float color = 0.0;
	color += pow(size / dist1, 2.0);
	color += pow(size / dist2, 2.0);
	color += pow(size / dist3, 2.0);

	gl_FragColor = vec4(vec3(color / 1.0, color / 1.0, color / 1.0), 1.0);
} 
