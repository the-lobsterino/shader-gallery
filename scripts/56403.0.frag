#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

// inspired by
// https://github.com/r21nomi/ShaderArtworks/blob/master/rotation/multiple_rotation_1.frag

# define PI 3.14159265359

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

// mat2: 2行列
// 回転行列
// https://nogson2.hatenablog.com/entry/2017/11/09/234006
mat2 rotate2d(float _angle){
	return mat2(cos(_angle), -sin(_angle),
		               sin(_angle), cos(_angle));
}

float box(vec2 st, vec2 size) {
	vec2 newSize = vec2(0.5) - size * 0.5;
	vec2 uv = step(newSize, st);
	uv *= step(newSize, vec2(1.0) - st);
	return uv.x * uv.y;
}

float cross(vec2 st, float size) {
	//  x , y それぞれを 1/4 にすることで作った長方形を2つ組み合わせて十字を表現
	return box(st, vec2(size, size / 4.0)) + box(st, vec2(size / 4.0, size));	
}


void main( void ) {
	// 正規化
	// st の値が-1.0~1.0 になる
	vec2 st = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
	
	float interval = 0.22;
	float size = 0.2;
	vec2 newSt = mod(st, interval);
	
	//それぞれを中心へ移動
	newSt -= vec2(interval / 2.0);
	// 回転
	newSt *= rotate2d(sin(time) * PI);
	// 回転軸を中心に
	newSt += vec2(0.5);
	vec3 color = vec3(sin(time + st.x * st.y),cross(newSt, size),sin(time + st.x * st.y));

//	vec3 color = vec3(sin(time + st.x * st.y),cross(st, 2.0), sin(time + st.x * st.y));

	gl_FragColor = vec4(color, 1.0);
}