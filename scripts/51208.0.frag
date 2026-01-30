#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

precision mediump float;
uniform float time;
uniform vec2 resolution;

float rand(vec2 st)
{
	return fract(
		sin(
			dot(st, vec2(12.9898, 78.233))
			) *  43758.5453);
}

// 距離関数
float randLine(vec2 st)
{
	st = vec2(time * 0.00001, st.y);
	float y = rand(st) - 0.004;

	return step(0.982, y);
}

void main() {
	// 画面の座標を-1~1の間に正規化
	vec2 uv = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);

	// 画面の座標を0~1の間に正規化
	uv = (gl_FragCoord.xy * 1.0) / min(resolution.x, resolution.y);

	// 繰り返し処理
// uv = fract(uv * 1.0);

  float d = randLine(uv);

	gl_FragColor = vec4(vec2(d), 1.0 ,1.0);
}
