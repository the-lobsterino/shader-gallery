#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float box2d(vec2 uv, float s){
	// |x| < s かつ |y| < s を満たす場合は1を返す
	// それ以外は0を返す
	return step(abs(uv.x), s) * step(abs(uv.y), s);
}


float box2dline(vec2 uv, float s)
{
	// 大きさsの正方形の辺にuvが重なっていた場合は1を返す
	// それ以外は0を返す
	return box2d(uv, s + 0.001) - box2d(uv, s);
}	

void main( void ) {

	vec2 uv= ( gl_FragCoord.xy / resolution.x ); // 座標
		
	float n = 1.0; // 分割数
	
	uv = fract(uv * n);
	
	uv -= vec2(0.5, 0.5 * resolution.y / resolution.x); // 画面中心に合わせる
	uv *= 2.0; // 座標の正規化
	
	float size = 0.5 * resolution.y / resolution.x; // 正方形の大きさ	
	gl_FragColor = vec4( 0.05 + 0.9 * box2dline(uv, size));
}