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

float noise(vec3 p) {
    // vec3 a = floor(p);
    vec3 a = p;
    return fract(perm(perm(a.xxxx)) / 41.0).x;
}

void main( void ) {

	vec2 uv = ( gl_FragCoord.xy - resolution.xy / 2.0 ) / resolution.y;

	vec3 color = vec3(0, 0, 0);
	color = noise(vec3(uv * 100.0, 0.0)) * vec3(1, 1, 1);

	gl_FragColor = vec4( color, 1.0 );

}