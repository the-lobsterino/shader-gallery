// http://glslsandbox.com/ で動作確認しています。
#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D backbuffer;


// ユーザー定義
#define REPEAT_NUM 10
#define PI 3.14159265359
#define PI2 (PI * 2.)


// [HSV to RGB]
// http://www.demoscene.jp/?p=1460 より引用
vec3 Hue_(float hue)
{
	vec3 rgb = fract(hue + vec3(0.0, 2.0/3.0, 1.0/3.0));
	rgb = abs(rgb*2.0 - 1.0);
	return clamp(rgb*3.0-1.0, 0.0, 1.0);
}
vec3 HSVtoRGB(vec3 hsv)
{
	return ((Hue_(hsv.x)-1.0)*hsv.y + 1.0) * hsv.z;
}
// [END HSV to RGB]

void main( void ) 
{
	vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
	vec3 color = vec3(0.);
	
	for (int i=1; i <= 10; ++i)
	{
		float f = float(i) * 0.2;
		// 点の位置設定
		vec2 dir = p - vec2(cos(time*f), sin(time*f)) * 0.25;
		// 色の設定
		vec3 col = HSVtoRGB(vec3(float(i) * PI / 10.0, 1.0, 1.0));
		color += col / (256. * (1.0 - length(dir)));
	}
	gl_FragColor = vec4(vec3(color), 1.0);	
}