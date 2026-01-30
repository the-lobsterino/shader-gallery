#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define pi 3.141592653
#define epsilon 0.012
#define maxmarch 64


// 2次元乱数
vec2 random2(vec2 st)
{
	st = vec2(dot(st, vec2(127.1, 311.7)), dot(st, vec2(269.5, 183.3)));
	return normalize(-1.0 + 2.0 * fract(sin(st)*43758.5453123));
}

// イージング関数
float easing(float x) { return 6.0 * pow(x, 5.0) - 15.0 * pow(x, 4.0) + 10.0 * pow(x, 3.0); }

// パーリンノイズ
float perline(vec2 position)
{
	// 入力座標の整数部分と小数部分を求める
	vec2 vec_i = floor(position);
	vec2 vec_f = fract(position);
	
	// 格子点におけるランダムな勾配ベクトル
	vec2 rand00 = random2(vec_i + vec2(0.0, 0.0));
	vec2 rand10 = random2(vec_i + vec2(1.0, 0.0));
	vec2 rand01 = random2(vec_i + vec2(0.0, 1.0));
	vec2 rand11 = random2(vec_i + vec2(1.0, 1.0));
	
	// 格子点から入力座標への距離ベクトル
	vec2 dist00 = vec_f - vec2(0.0, 0.0);
	vec2 dist10 = vec_f - vec2(1.0, 0.0);
	vec2 dist01 = vec_f - vec2(0.0, 1.0);
	vec2 dist11 = vec_f - vec2(1.0, 1.0);
	
	// 格子点における二つのベクトルの内積
	float value00 = dot(rand00, dist00);
	float value10 = dot(rand10, dist10);
	float value01 = dot(rand01, dist01);
	float value11 = dot(rand11, dist11);
	
	// 4つの値を線形補間
	float value0 = mix(value00, value10, easing(vec_f.x));
	float value1 = mix(value01, value11, easing(vec_f.x));
	return mix(value0, value1, easing(vec_f.y)) * 0.5 + 0.5 ;
}

// 5段fBMノイズ
float fBM_5step(vec2 position)
{
	float value = 0.0;
	float amplitude = 0.5;
	for(int i = 0; i < 5; ++i)
	{
		value += amplitude * perline(position);
		amplitude *= 0.5;
		position *= 2.0;
	}
	return value;
}

// 9段fBMノイズ
float fBM_9step(vec2 position)
{
	float value = 0.0;
	float amplitude = 0.5;
	for(int i = 0; i < 9; ++i)
	{
		value += amplitude * perline(position);
		amplitude *= 0.5;
		position *= 2.0;
	}
	return value;
}

// fBMノイズによる地形
// 地形を生成するため、解像度を落とし、乱数の値を大きくする
float Terrain_5(vec2 position) { return fBM_5step(position); }
float Terrain_9(vec2 position) { return fBM_9step(position); }

// 地形マップ
float map(vec3 position)
{
	return Terrain_5(position.xz) + position.y;
}

// 法線ベクトル
vec3 map_norm(vec3 position)
{
	vec2 d = vec2(epsilon, 0.0);
	float x = map(position + d.xyy) - map(position);
	float y = map(position + d.yxy) - map(position);
	float z = map(position + d.yyx) - map(position);
	return normalize(vec3(x, y, z));
}

// 光源の方向
vec3 Light_env = normalize(vec3(1.0, 1.0, -1.0));

// カメラの情報
struct Camera
{
	vec3 position;
	vec3 direction;
	vec3 up;
	vec3 side;
};

// レイの情報
struct Ray
{
	vec3 position;
	vec3 direction;
};

void main(void)
{
	// GLSL座標の正規化
	vec2 position = (gl_FragCoord.xy * 2.0 - resolution) / max(resolution.x, resolution.y);
	
	// カメラの生成
	Camera camera;
	camera.position = vec3(sin(time), 0.0, time);
	camera.direction = vec3(0.0, - sin( pi / 6.0), cos(pi / 6.0));
	camera.up = vec3(0.0, cos(pi / 6.0), sin( pi / 6.0));
	camera.side = normalize(cross(camera.up, camera.direction));
	
	// レイの生成
	Ray ray;
	ray.position = camera.position;
	ray.direction = normalize(camera.side * position.x + camera.up * position.y + camera.direction);
	
	// 距離
	float distance;
	
	// 色
	vec3 color = vec3(1.0, 1.0, 0.8);
	
	// レイマーチング
	for(int i = 0; i < maxmarch; ++i)
	{
		distance = map(ray.position);
		
		if(distance < epsilon)
		{
			const vec3 c = vec3(1.0, 0.4, 0.0);
			vec3 norm = map_norm(ray.position);
			color = vec3(dot(Light_env, norm)) * c;
			break;
		}
		
		else ray.position += ray.direction * distance;
	}
	
	// 色を出力して終わり
	gl_FragColor = vec4(color, 1.0);
}