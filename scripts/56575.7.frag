#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

// 適当な素数
#define PRIME 17.0
#define SQUARE (PRIME * PRIME)

// xyzwそれぞれについて適当な素数の2乗で割ったあまりを返す
float mod289(float x){return mod(x, SQUARE);}
vec4 mod289(vec4 x){return mod(x, SQUARE);}

// 適当に入力の値を非線形にしてmod289に渡すことで結果が複雑になることを期待する
// 0から離れるほどノイジーになる
vec4 perm(vec4 x){return mod289((2.0 * PRIME * x * x) + x);}

float noise(vec3 p){
    vec3 a = floor(p);

    // 補間のために現在描画しようとしている位置周辺の8箇所についてノイズの値を求める
    vec4 b = a.xxyy + vec4(0.0, 1.0, 0.0, 1.0);
    vec4 k1 = perm(b.xyxy);
    vec4 k2 = perm(k1.xyxy + b.zzww);
	
    vec4 c = k2 + a.zzzz;
    vec4 k3 = perm(c);
    vec4 k4 = perm(c + 1.0);

    vec4 o1 = fract(k3 / 41.0);
    vec4 o2 = fract(k4 / 41.0);

    // 補間のためのxyzそれぞれについての位置を求める
    vec3 d = fract(p);
    // イージング: https://www.wolframalpha.com/input/?i=Plot%5B3d%5E2+-+2d%5E3,+%7Bd,+0,+1%7D%5D
    d = d * d * (3.0 - 2.0 * d);
	
    // o1.xyzw, o2.xyzwの8つの値を補間して1つの値に落とし込む
    vec4 o3 = mix(o1, o2, d.z);
    vec2 o4 = mix(o3.xz, o3.yw, d.x);
    float o5 = mix(o4.x, o4.y, d.y);
	
    return o5;
}

void main( void ) {

	vec2 uv = ( gl_FragCoord.xy - resolution.xy / 2.0 ) / resolution.y;

	vec3 color = vec3(0, 0, 0);
	color = noise(vec3(uv * 10.0, 0.0)) * vec3(1, 1, 1);

	gl_FragColor = vec4( color, 1.0 );

}