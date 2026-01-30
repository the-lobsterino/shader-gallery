#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D backbuffer;

vec2 tex(vec2 uv)
{
	return texture2D(backbuffer, uv).xy - 0.5;
}

void main( void ) {

	vec2 pos = ( gl_FragCoord.xy / resolution.xy) - mouse;
	vec2 uv =  ( gl_FragCoord.xy / resolution.xy );
	vec2 prev = tex(uv);
	vec2 pixel = 1./resolution;

	// ラプラシアンフィルタで加速度を計算
	float accel = (
		tex(uv + pixel * vec2(-1, -1)).x +
		tex(uv + pixel * vec2(1, -1)).x +
		tex(uv + pixel * vec2(-1, 1)).x +
		tex(uv + pixel * vec2(1, 1)).x +
		tex(uv + pixel * vec2(0, 1)).x * 2. +
		tex(uv + pixel * vec2(1, 0)).x * 2. +
		tex(uv + pixel * vec2(0, -1)).x * 2. +
		tex(uv + pixel * vec2(-1, 0)).x * 2. +
		tex(uv).x * 4.
	) / 16. - prev.x;
	
	// 伝播速度を掛ける
	accel *= 4.0;

	// 現在の速度に加速度を足し、さらに減衰率を掛ける
	float velocity = (prev.y + accel) * 0.9;

	// 高さを更新
	float height = prev.x + velocity;

	// マウス位置に波紋を出す
	if (fract(time) < 0.1) {			
		height += (sin((length(pos) - time * 20.) * 3.) * .5 + .5) / length(pos * 300.);
	}
	gl_FragColor = vec4(height + 0.5, velocity + 0.5, 0, 1);

}