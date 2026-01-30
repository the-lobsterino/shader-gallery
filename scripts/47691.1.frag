// Simple ray tracer by Yukihiro Iizuka
// based on the ray tracer in Ray Tracing in One Weekend by Peter Shirley (https://github.com/petershirley/raytracinginoneweekend)

// 処理が重い場合は、右上にある "1" という数字を大きくすると軽くなる

// SPP: number of samples per pixel
// SPP を大きくすると計算が重くなるが、ノイズが減る
#define SPP 1

#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
precision mediump float;

#define PI 3.14159265359

// レイ
struct Ray {
  vec3 origin;
  vec3 direction;
};


// 球
struct Sphere {
  vec3 center;
  float radius;
  vec3 color;
  int material;
  float material_arg1; // マテリアルの追加情報 (使わなくてもいい)
};

// レイを生成するためのデータ
// setup_rendering_plane() で値を代入する
struct RenderingFilm {
  vec3 origin;
  vec3 bottom_left;
  vec3 u;
  vec3 v;
};

// レイとオブジェクトの交点に関する情報
// shade() 関数に渡される
// オブジェクトとは独立する
struct HitRecord {
  float t;
  vec3 point;
  vec3 normal;
  vec3 ray_direction;
  vec3 emission;
  int material;
  float material_arg1; // マテリアルの追加情報 (使わなくてもいい)
};

// マテリアルの種類
// LAMBERTIANの追加情報: 無し
#define MATERIAL_LAMBERTIAN 1
// METALの追加情報: fuzz (表面の滑らかさ)
#define MATERIAL_METAL 2

// ランダム関数たち
float random_seed;

// ランダム関数 --- 十分にランダムではないので、高解像度 + 低spp のとき視認できる模様ができる 
float random() { return fract(sin(random_seed++) * 345695.23523423); }

vec3 random_on_sphere() {
  float z = 2.0 * random() - 1.0;
  float r = sqrt(1.0 - z * z);
  float angle = (random() + 1.0) * PI;
  return vec3(r * cos(angle), r * sin(angle), z);
}

vec3 random_in_sphere() {
  vec3 ans = 2.0 * vec3(random(), random(), random()) - 1.0;
  for (int i = 0; i < 100; i++) {
    if (length(ans) < 1.0) {
      break;
    }
    ans = 2.0 * vec3(random(), random(), random()) - 1.0;
  }
  return ans;
}

vec3 random_in_hemisphere(vec3 normal) {
  vec3 v = random_in_sphere();
  return v * sign(dot(v, normal));
}

vec3 random_on_hemisphere(vec3 normal) {
  vec3 v = random_on_sphere();
  return v * sign(dot(v, normal));
}

// グローバル変数たち
const float r = 1.0;
const Sphere sphere0 = Sphere(vec3(-3.0 * r, r, 11.0), r, vec3(0.2, 0.15, 0.5), MATERIAL_METAL, 0.3);
const Sphere sphere1 = Sphere(vec3(-r, r, 9.0), r, vec3(0.2, 0.5, 0.5), MATERIAL_LAMBERTIAN, 0.0);
const Sphere sphere2 = Sphere(vec3(r, r, 7.0), r, vec3(0.3, 0.7, 1.0), MATERIAL_METAL, 0.2);
const Sphere sphere3 = Sphere(vec3(3.0 * r, r, 5.0), r, vec3(0.8, 0.4, 0.2), MATERIAL_LAMBERTIAN, 0.0);

const Sphere sphere4 = Sphere(vec3(-3.0 * r, r + 2.5, 11.0), r, vec3(0.5, 0.5, 0.1), MATERIAL_LAMBERTIAN, 0.0);
const Sphere sphere5 = Sphere(vec3(-r, r + 2.5, 9.0), r, vec3(0.4, 0.1, 0.5), MATERIAL_METAL, 0.0);
const Sphere sphere6 = Sphere(vec3(r, r + 2.5, 7.0), r, vec3(0.8, 0.1, 0.2), MATERIAL_LAMBERTIAN, 0.0);
const Sphere sphere7 = Sphere(vec3(3.0 * r, r + 2.5, 5.0), r, vec3(0.1, 0.1, 0.52), MATERIAL_METAL, 0.5);

const Sphere sphere8 = Sphere(vec3(3.0 * r, r, 15.0), 3.0 * r, vec3(0.9, 0.9, 0.9), MATERIAL_METAL, 0.0);
const Sphere sphere9 = Sphere(vec3(-2.0 * r, r, 5.0), 0.75 * r, vec3(0.2, 0.9, 0.1), MATERIAL_LAMBERTIAN, 0.0);

const Sphere ground = Sphere(vec3(0, -1000.0, 0.0), 1000.0, vec3(0.8, 0.8, 0.0), MATERIAL_LAMBERTIAN, 0.0);
const Sphere wall_left = Sphere(vec3(-1004.0, 0.0, 0.0), 1000.0, vec3(0.8, 0.2, 0.4), MATERIAL_LAMBERTIAN, 0.0);
const Sphere wall_right = Sphere(vec3(1004.0, 0.0, 0.0), 1000.0, vec3(0.3, 0.2, 0.6), MATERIAL_LAMBERTIAN, 0.0);
const Sphere wall_front = Sphere(vec3(0.0, 0.0, 1020.0), 1000.0, vec3(0.1, 0.1, 0.5), MATERIAL_LAMBERTIAN, 0.0);

RenderingFilm film;

vec3 ray_at(Ray ray, float t) { return ray.origin + t * ray.direction; }

// カメラの情報から RenderingFilm を設定する
void setup_rendering_film(const vec3 lookfrom, // カメラの位置
                          const vec3 lookat,   // カメラの視点
                          const vec3 vup,      // カメラの上ベクトル
                          const float vfov,    // カメラの視野角
                          const float aspect   // カメラのアスペクト比
) {
  // この3つのベクトルがカメラ座標系の基底をなす
  vec3 direction = normalize(lookat - lookfrom);
  vec3 unit_u = normalize(cross(vup, direction));
  vec3 unit_v = cross(direction, unit_u);

  // Film についての情報を計算する
  float focus_distance = length(lookat - lookfrom);
  float theta = vfov * PI / 180.0;
  float half_height = tan(theta / 2.0) * focus_distance;
  float half_width = aspect * half_height;

  // film に値を設定
  film.origin = lookfrom;
  film.bottom_left = lookat - (half_width * unit_u + half_height * unit_v);
  film.u = 2.0 * half_width * unit_u;
  film.v = 2.0 * half_height * unit_v;
}

// uv ∈ [0, 1]^2 から、対応するレイを計算する
Ray get_ray(vec2 uv) {
  vec3 stride_u = uv.x * film.u;
  vec3 stride_v = uv.y * film.v;
  vec3 target = film.bottom_left + stride_u + stride_v;
  return Ray(film.origin, normalize(target - film.origin));
}

// 球とレイが接触するか調べる
// record.t より近い点で交わるなら、record を更新して true を返す
// それ以外なら何もいじらずに false を返す
bool intersect(Sphere sphere, Ray ray, inout HitRecord record) {
  // epsilon より近い場合は接触したとみなさない
  // 跳ね返ったレイが跳ね返った物体に接触するのを防止する
  const float epsilon = 1.e-4;

  vec3 oc = ray.origin - sphere.center;
  float a = dot(ray.direction, ray.direction);
  float b = dot(oc, ray.direction);
  float c = dot(oc, oc) - sphere.radius * sphere.radius;
  float discriminant2 = b * b - a * c;

  if (discriminant2 < 0.0) {
    //  接触は起こらない
    return false;
  }

  float discriminant = sqrt(discriminant2);

  // 前の交点
  float t = (-b - discriminant) / a;
  if (t > epsilon && t < record.t) {
    // 接触は起こり、かつ接触点は今までで一番近い
    record.t = t;
    record.point = ray_at(ray, t);
    record.normal = (ray_at(ray, t) - sphere.center) / sphere.radius;
    record.emission = sphere.color;
    record.ray_direction = ray.direction;
    record.material = sphere.material;
    record.material_arg1 = sphere.material_arg1;
    return true;
  }

  // 後ろの交点
  t = (-b + discriminant) / a;
  if (t > epsilon && t < record.t) {
    // 接触は起こり、かつ接触点は今までで一番近い
    record.t = t;
    record.point = ray_at(ray, t);
    record.normal = (ray_at(ray, t) - sphere.center) / sphere.radius;
    record.emission = sphere.color;
    record.ray_direction = ray.direction;
    record.material = sphere.material;
    record.material_arg1 = sphere.material_arg1;
    return true;
  }

  // 接触はレイの始点にとても近い
  return false;
}

// record の基づいて色を計算する
void shade(
    // レイの交点の情報 (オブジェクトの情報では *ない* )
    HitRecord record,
    // 色の減衰
    out vec3 attenuation,
    // 散乱が起こるか ?
    out bool is_scattered,
    // 散乱後のレイ (is_scattered == false のとき、意味を持たない)
    out Ray scattered) {
  if (record.material == MATERIAL_LAMBERTIAN) {
    attenuation = record.emission;
    is_scattered = true;
    // 注意: この scattered は厳密には Lambertian ではないが、ほぼ等しい
    //       厳密な Lambertian に比べて y-up 方向にレイが多く飛ぶので、
    //       (上方向に空がある) 今回使用した設定では収束が早くなる
    scattered = Ray(record.point, record.normal + 0.99 * random_in_sphere());
  } else if (record.material == MATERIAL_METAL) {
    attenuation = record.emission;
    // fuzz の値に従って反射後のレイを完全反射からずらす
    vec3 scattered_dir = reflect(record.ray_direction, record.normal) + random_in_sphere() * record.material_arg1;
    scattered = Ray(record.point, scattered_dir);
    is_scattered = dot(scattered.direction, record.normal) > 0.0;
  }
}

// uv ∈ [0, 1]^2 の色を計算する
vec3 color(vec2 uv) {
  Ray ray = get_ray(uv);
  HitRecord record;
  vec3 answer_color = vec3(0.0, 0.0, 0.0);
  vec3 total_attenuation = vec3(1.0, 1.0, 1.0);

  for (int i = 0; i < 20; i++) { // 反射を最大20回追跡する
    record.t = 1.e31;
    intersect(sphere0, ray, record);
    intersect(sphere1, ray, record);
    intersect(sphere2, ray, record);
    intersect(sphere3, ray, record);
    intersect(sphere4, ray, record);
    intersect(sphere5, ray, record);
    intersect(sphere6, ray, record);
    intersect(sphere7, ray, record);
    intersect(sphere8, ray, record);
    intersect(sphere9, ray, record);
    intersect(ground, ray, record);
    intersect(wall_left, ray, record);

    // ものが多すぎると収束しないので省いておく
    // intersect(wall_right, ray, record);
    // intersect(wall_front, ray, record);

    if (record.t > 1.e30) {
      // レイは無限遠に飛んでいった
      // 空の色を返す
      float t = 0.5 * (normalize(ray.direction).y + 1.0);
      vec3 color = (1.0 - t) * vec3(1.0, 1.0, 1.0) + t * vec3(0.4, 0.6, 0.9);
      return total_attenuation * color;
    }

    // レイは何かに当たった
    // 反射を計算する
    bool is_scattered;
    vec3 attenuation;
    shade(record, attenuation, is_scattered, ray);

    if (!is_scattered) {
      // 反射によって新たなレイが生成されることはない
      return total_attenuation * record.emission;
    }

    // レイの反射によって新たなレイが生成される
    // 減衰を更新して次のループへ
    total_attenuation *= attenuation;
  }

  return answer_color;
}

void main() {
  // このピクセルが担当する uv 座標を計算
  vec2 uv = vec2(gl_FragCoord.xy / resolution);
  float aspect = resolution.x / resolution.y;

  // RenderingFilm のセットアップ
  setup_rendering_film(vec3(0.0, 3.5, -7.5), vec3(0.0, 0.0, 10.0), vec3(0.0, 1.0, 0.0), 30.0, aspect);

  // ランダムシードを計算
  random_seed = fract(time * 46.2343 * sin(dot(uv.xy, vec2(34.12312, 15.57377))));

  // 色を計算する
  vec3 color_mean = vec3(0.0, 0.0, 0.0);
  for (int i = 0; i < SPP; i++) {
    // ランダムなズレを追加する
    vec2 jitter = vec2(random(), random()) / resolution;
    color_mean += color(uv + jitter) / float(SPP);
  }

  // ガンマ補正をする
  // g = 2 はてきとう
  gl_FragColor = vec4(sqrt(color_mean), 1.0);
}
