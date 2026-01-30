

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

//球の距離関数
float sphere_d(vec3 p){
	return length(p) - 1.3;

}

//オブジェクトの補完
float smin(float d1, float d2, float k){
	float res = exp(-k * d1) + exp(-k * d2);
	return -log(res) / k;
}

//四角の距離関数
float box_d(vec3 p){
	return length(max(abs(p) - vec3(1.0,1.0,1.0),0.0));
}

//オブジェクトの距離関数
float object_d(vec3 pos){
	vec3 p = mod(pos, 8.0) - 4.0;
	return smin(sphere_d(p), box_d(p), 1.0);
	//return min(sphere_d(p), box_d(p));
}

//気持ち悪いやつの距離関数
#define ITERATIONS 5

float dePseudoKleinian(vec3 p) {
    vec3 csize = vec3(0.90756, 0.92436, 0.90756);
    float size = 1.0;
    vec3 c = vec3(0.000321);
    float defactor = 1.0;
    vec3 offset = vec3(0.0);
    vec3 ap = p + 1.0;
    for (int i = 0; i < ITERATIONS; i++) {
        ap = p;
        p = 2.0 * clamp(p, -csize, csize) - p;
        float r2 = dot(p, p);
        float k = max(size / r2, 1.0);
        p *= k;
        defactor *= k;
        p += c;
    }
    float r = abs(0.5 * (p.y - offset.y) / defactor);
    return r;
}

//Mandelbox
#define foldingLimit 1.0
vec3 boxFold(vec3 z, float dz) {
    return clamp(z, -foldingLimit, foldingLimit) * 2.0 - z;
}

void sphereFold(inout vec3 z, inout float dz, float minRadius, float fixedRadius) {
    float m2 = minRadius * minRadius;
    float f2 = fixedRadius * fixedRadius;
    float r2 = dot(z, z);
    if (r2 < m2) {
        float temp = (f2 / m2);
        z *= temp;
        dz *= temp;
    } else if (r2 < f2) {
        float temp = (f2 / r2);
        z *= temp;
        dz *= temp;
    }
}

float deMandelbox(vec3 p, float scale, float minRadius, float fixedRadius) {
    vec3 z = p;
    float dr = 1.0;
    for (int i = 0; i < ITERATIONS; i++) {
        z = boxFold(z, dr);
        sphereFold(z, dr, minRadius, fixedRadius);
        z = scale * z + p;
        dr = dr * abs(scale) + 1.0;
    }
    float r = length(z);
    return r / abs(dr);
}

float de(vec3 p) {
    return deMandelbox(p, 10.0, 0.5, 2.0);
}

//球の法線
vec3 sphere_Normal(vec3 p){
	float d = 0.01;
	
	return normalize(vec3(
		sphere_d(p + vec3(d,0,0)) - sphere_d(p + vec3(-d,0,0)),
		sphere_d(p + vec3(0,d,0)) - sphere_d(p + vec3(0,-d,0)),
		sphere_d(p + vec3(0,0,d)) - sphere_d(p + vec3(0,0,-d))
	));
}

//ボックス法線
vec3 box_Normal(vec3 p){
	float d = 0.08;
	
	return normalize(vec3(
		box_d(p + vec3(d,0,0)) - box_d(p + vec3(-d,0,0)),
		box_d(p + vec3(0,d,0)) - box_d(p + vec3(0,-d,0)),
		box_d(p + vec3(0,0,d)) - box_d(p + vec3(0,0,-d))
	));
}

//オブジェクトの関集合の法線
vec3 object_Normal(vec3 p){
	float d = 0.001;
	
	return normalize(vec3(
		object_d(p + vec3(d,0,0)) - object_d(p + vec3(-d,0,0)),
		object_d(p + vec3(0,d,0)) - object_d(p + vec3(0,-d,0)),
		object_d(p + vec3(0,0,d)) - object_d(p + vec3(0,0,-d))
	));
}


//気持ち悪いやつの法線
vec3 dePseudoKleinian_Normal(vec3 p){
	float d = 0.001;
	
	return normalize(vec3(
		dePseudoKleinian(p + vec3(d,0,0)) - dePseudoKleinian(p + vec3(-d,0,0)),
		dePseudoKleinian(p + vec3(0,d,0)) - dePseudoKleinian(p + vec3(0,-d,0)),
		dePseudoKleinian(p + vec3(0,0,d)) - dePseudoKleinian(p + vec3(0,0,-d))
	));
}

//Mandelboxの法線
vec3 deMandel_Normal(vec3 p){
	float d = 0.001;
	
	return normalize(vec3(
		de(p + vec3(d,0,0)) - de(p + vec3(-d,0,0)),
		de(p + vec3(0,d,0)) - de(p + vec3(0,-d,0)),
		de(p + vec3(0,0,d)) - de(p + vec3(0,0,-d))
	));
}

//レイの構造体
struct Ray{
	vec3 pos;
	vec3 dir;
};
	

//回転行列ｘ	
mat3 x_axis_rot(float angle){
	float c = cos(angle);
	float s = sin(angle);
	
	return mat3(1.0,0.0,0,
		    0.0,c,s,
		    0.0,-s,c);
	
}

//回転行列ｙ
mat3 y_axis_rot(float angle){
	float c = cos(angle);
	float s = sin(angle);
	
	return mat3(c,0.0,s,
		   0.0,1.0,0.0,
		   -s,0.0,c);
}

//描画
void main( void ) {

	//座標を中心に合わせる
	vec2 pos = (gl_FragCoord.xy * 2.0 - resolution)  / max(resolution.x, resolution.y);
	vec2 mouse_pos = (mouse - 0.5) * 2.0;
	mouse_pos.y *= resolution.y / resolution.x;
	
	//カメラの初期設定
	vec3 camera_pos = vec3(0.0,0.0,-3.0);
	vec3 camera_up = vec3(0.0,1.0,0.0);
	vec3 camera_dir = vec3(0.0,0.0,1.0);
	vec3 camera_side = cross(camera_up,camera_dir);
	
	//レイの初期化
	Ray ray;
	ray.pos = camera_pos;
	ray.dir = pos.x * camera_side + pos.y * camera_up + camera_dir;
	
	//回転
	mat3 rot = x_axis_rot(-mouse_pos.y) * y_axis_rot(-mouse_pos.x);
	
	//レイマーチング
	float t = 0.0,d;
	for(int i = 0; i < 64;i++){
		
		//距離関数いれるとこ
		d = object_d(rot * ray.pos);
		
		if(d < 0.001){
			break;
		}
		t += d;
		ray.pos = camera_pos + t * ray.dir;
	}
	
	vec3 light_dir = vec3(mouse_pos,1.0);
	
	//法線いれるとこ
	vec3 normal = object_Normal(rot * ray.pos);
	
	//色
	vec3 albedo = vec3(0.6,0.1,0.2);
	
	float l =dot(normal, - light_dir);
	
	//描画
	if(d < 0.001){
		gl_FragColor = vec4(l * albedo.x, l * albedo.y, l * albedo.z, 1.0) + 0.3;
	}else{
		gl_FragColor = vec4(0);
	}
}