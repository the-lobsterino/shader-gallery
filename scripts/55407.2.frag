precision mediump float;
//var message="[残]{のこ}してはいけない。";window.onbeforeunload=function(event){var e=e||window.event;if(e){e.returnValue=message;}return message;};
#extension GL_OES_standard_derivatives : enable
//これはまた何ですか？
//私に[道]{みち}を見せてもらえますか？
//フレーズの[繰]{く}り[返]{かえ}しをやめます。
//私はその[言語]{げんご}を[話]{はな}しません。
//[家]{いえ}に[帰]{かえ}る[前]{まえ}にどうすればいいですか？
//それはピスタチオ、そしてマジパンだったか？
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
#define PI 3.14159265358979323846264338327950288419716939937
#define TAU 6.28318530717958647692528676655900576839433879875
float nsin(float x){return(sin(x*TAU)+1.)/2.;}
float ncos(float x){return(cos(x*TAU)+1.)/2.;}
#ifndef saturate
#define saturate(v) clamp(v,0.,1.)
#endif
vec3 hue2rgb(float hue){
	hue=fract(hue);
	return saturate(vec3(
		abs(hue*6.-3.)-1.,
		2.-abs(hue*6.-2.),
		2.-abs(hue*6.-4.)
	));
}
void main(void){
	vec2 pixel=floor(gl_FragCoord.xy);
	vec2 uv=gl_FragCoord.xy/resolution;
	vec2 p=vec2((uv.x-.5)/(resolution.y/resolution.x),uv.y-.5);
	float c=(atan(p.y,p.x)+PI)/TAU;
	c=fract((length(p)*sin(time)*2.)+c-time);
	gl_FragColor=vec4(hue2rgb(c),1.);
}