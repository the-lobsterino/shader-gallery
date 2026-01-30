#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define PI 3.141592653

// 回転行列
mat3 rotation(vec3 axis, float argument)
{
	return mat3(
		axis.x * axis.x * (1.0 - cos(argument)) + cos(argument),
		axis.y * axis.x * (1.0 - cos(argument)) - axis.z * sin(argument),
		axis.z * axis.x * (1.0 - cos(argument)) + axis.y * sin(argument),
		axis.x * axis.y * (1.0 - cos(argument)) + axis.z * sin(argument),
		axis.y * axis.y * (1.0 - cos(argument)) + cos(argument),
		axis.z * axis.y * (1.0 - cos(argument)) - axis.x * sin(argument),
		axis.x * axis.z * (1.0 - cos(argument)) - axis.y * sin(argument),
		axis.y * axis.z * (1.0 - cos(argument)) + axis.x * sin(argument),
		axis.z * axis.z * (1.0 - cos(argument)) + cos(argument)
	);
}

// オブジェクト間を補間
float smooth(float dist1, float dist2, float k)
{
    float h = exp(-k * dist1) + exp(-k * dist2);
    return -log(h) / k;
}

// 直方体の情報
struct Box
{
	vec3 position;
	vec3 size;
	float round;
};
	
// 直方体の距離関数
float Box_dist(Box box, vec3 position)
{
	vec3 d = abs(position - box.position) - box.size;
	return length(max(d, 0.0)) - box.round + min(max(d.x,max(d.y,d.z)),0.0);
}

// 六角柱の情報
struct Hexprism
{
	vec3 position;
	float scale;
	float height;
	float round;
};

// 上向きの六角柱の距離関数
float Hexprism_dist(Hexprism prism, vec3 position)
{
	const vec3 k = vec3(-sqrt(3.0) / 2.0, 0.5, 1.0 / sqrt(3.0));
	position = abs((position - prism.position) * rotation(vec3(1.0, 0.0, 0.0), PI / 2.0));
	position.xy -= 2.0*min(dot(k.xy, position.xy), 0.0) * k.xy;

	vec2 dist = vec2(
		length(position.xy - vec2(clamp(position.x, - k.z * prism.scale, k.z * prism.scale), prism.scale)) * sign(position.y - prism.scale),
		position.z - prism.height
	);

	return min(max(dist.x, dist.y),0.0) + length(max(dist, 0.0)) - prism.round;
}

// 物体全体の距離関数
float map(vec3 position)
{
	// 土台の六角柱
	Hexprism base;
	base.position = vec3(6.0, 0.15, 0.0);
	base.scale = 1.5;
	base.height = 0.3;
	base.round = 0.2;
	float dist_base = Hexprism_dist(base, position);
	
	Hexprism pillar;
	pillar.position = vec3(6.0, 4.0, 0.0);
	pillar.scale = 1.0;
	pillar.height = 4.0;
	pillar.round = 0.0;
	float dist_pillar = Hexprism_dist(pillar, position);
	
	Box floor1;
	floor1.position = vec3(6.0, -0.5, 0.0);
	floor1.size = vec3(3.0, 0.5, 4.0);
	floor1.round = 0.0;
	float dist_floor1= Box_dist(floor1, position);
	
	return min(dist_floor1, smooth(dist_base, dist_pillar, 8.0));
}

// 物体全体の法線ベクトル
vec3 norm(vec3 position)
{
	vec2 e = vec2(0.001, 0.0);
	float x = map(position + e.xyy) - map(position);
	float y = map(position + e.yxy) - map(position);
	float z = map(position + e.yyx) - map(position);
	return normalize(vec3(x, y, z));
}

// カメラの情報
struct Camera
{
	vec3 position;
	vec3 direction;
	float rotation;
};
	
// レイの情報
struct Ray
{
	vec3 position;
	vec3 direction;
};
	
// カメラからレイの生成
Ray camera_to_ray(Camera camera)
{
	vec2 pos = (gl_FragCoord.xy * 2.0 - resolution) / max(resolution.x, resolution.y);
	vec3 dir = camera.direction;
	vec3 up = vec3(sin(camera.rotation), cos(camera.rotation), 0.0);
	vec3 side = normalize(cross(up, dir));
	
	Ray ray;
	ray.position = camera.position;
	ray.direction = normalize(pos.x * side + pos.y * up + dir);
	return ray;
}

vec3 light = normalize(vec3(1.0, 1.0, -1.0));

// 生成したレイを元にレンダリング
vec3 render(Ray ray)
{
	// 色
	vec3 color = vec3(0.0);
	
	// レイマーチング
	for(int i = 0; i < 64; ++i)
	{
		// 物体との当たり判定
		float dist = map(ray.position);
		
		// 当っていれば色を指定してbreak
		if(dist < 0.001)
		{
			// 法線ベクトル
			vec3 normal = norm(ray.position);
			
			// 内積で色を求める
			color = dot(light, normal) + vec3(0.1);
			
			break;
		}
		
		// そうでなければレイを進める
		else 
		{
			ray.position += ray.direction * dist;
		}
	}
	
	return color;
}

void main(void) {
	
	// カメラの生成
	Camera camera;
	camera.position = vec3(0.0, 3.0, -10.0);
	camera.direction = vec3(0.0, 0.0, 1.0);
	camera.rotation = 0.0;
	
	// レイを生成する
	Ray ray = camera_to_ray(camera);
	
	// 生成したレイを元にレンダリング
	vec3 color = render(ray);
	
	// 色を出力して終わり
	gl_FragColor = vec4(color, 1.0);
}