#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	
	vec2 r = resolution;
	float t = time;
	float s = sin(t/4.0);           // サインを求める
   	float c = cos(t/4.0);           // コサインを求める
	
	vec2 p = (gl_FragCoord.xy * 2.0 - r) / min(r.x, r.y);
	mat2 m = mat2(c, s, -s, c); // 行列に回転用の値をセット
   	 p *= m;                     // 行列をベクトルに掛け合わせる
	vec2 q = mod(p, 0.2) - 0.1;
	float destColor = 0.0;
	p.x += (sin(time / 100.0 + (p.y / 30.0) ) ) * p.x * 30.0;
	p.y += (sin(time / 100.0 + (p.x / 30.0) ) ) * p.y * 30.0;
	
	float v = 2.1 / abs(p.y) * 0.5 * abs(p.x) * 0.5;   // ← 回転済みの座標を使って計算
    	float cr = v * abs(sin(t * 1.0) + 1.5);
    	float cg = v * abs(sin(t * 1.0) + 1.5);
    	float cb = v * abs(sin(t * 1.0) + 1.5);
	
	for(float i = 0.0; i < 50.0; i++){
		float j = i + 50.0;
		vec2 r = 0.25 / abs(length(q) - 0.5 / i) + vec2(cos(t * j), sin(t * j)) * 0.8;
		destColor += 0.15 / length(r) / 20.0;
	}
	gl_FragColor = vec4(cr*destColor*0.1, cg*destColor, cb*destColor, 1.0);
}