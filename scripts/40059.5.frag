#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;        // 時間経過
uniform vec2 mouse;        // マウスの位置
uniform vec2 resolution;   // スクリーンサイズ

void main( void ) {
	
	vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);  // スクリーン座標を正規化
	vec3 destColor = vec3(0.0);
	
	for(float i = 0.0; i < 5.0; i++){
		
		float j = i + 1.0;
		vec2 q =  p * vec2(cos(time * j), sin(time * j)) * 0.5;
		destColor += 0.05 / length(q);
	}
	
	gl_FragColor = vec4(destColor, 1.0);
	
	
}