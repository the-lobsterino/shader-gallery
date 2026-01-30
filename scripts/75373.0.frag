#extension GL_OES_standard_derivatives : enable

precision mediump float;
uniform float time;
uniform vec2 resolution;

#define PI 3.141592
float bpm = 90.;

struct Ray {
  vec3 pos;
  vec3 dir;
};

vec3 trans(vec3 p) {
  return mod(p, 4.0) - 2.0;
}

float obj_d(vec3 p) {
  const float r = 1.55;
	float sphere = length(mod(p, 4.5) - 2.0) - r;
  return sphere;
  // p = trans(p);
  // vec3 q = abs(p) - vec3(0.5);
  // return max(max(q.x, q.y), q.z);
}

vec3 obj_normal (vec3 pos) {
  float delta = 0.001;
  return normalize(vec3(
    obj_d(pos - vec3(delta, 0.0, 0.0)) - obj_d(pos),
    obj_d(pos - vec3(0.0, delta, 0.0)) - obj_d(pos),
    obj_d(pos - vec3(0.0, 0.0, delta)) - obj_d(pos)
  ));
}

void main() {
  vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / max(resolution.x, resolution.y);
  float tbpm = time * bpm / 60.;
  float seq = floor(tbpm);

	vec3 camera_pos = vec3(0.0, 0.0, -4.0);
  camera_pos.z -= time * 20. + 2. * abs(sin(tbpm) * 0.55);
	vec3 camera_up = normalize(vec3(0.0, 1.0, 0.0));
	vec3 camera_dir = normalize(vec3(0.0, 0.0, 1.0));
	vec3 camera_side = normalize(cross(camera_up, camera_dir));

  // ray marching
  Ray ray;
  ray.pos = camera_pos;
  ray.dir = normalize(p.x * camera_side + p.y * camera_up + camera_dir);

  float t = 0.0, d;
  for (int i = 0; i < 64; i++) {
    d = obj_d(ray.pos);
    if (d < 0.001) {
      break;
    }
    // 次のレイは最小距離 d * ray.dir分だけすすめる
    t += d;
    ray.pos = camera_pos + t * ray.dir;
  }
  // 光源ベクトル
  vec3 L = normalize(vec3(0.0, 0.0, 1.0));
  // オブジェクトの法線ベクトル
  vec3 N = obj_normal(ray.pos);
  // 光の色
  vec3 LColor = vec3(1.0, 1.0, 1.0);
  // 輝度
  vec3 I = dot(N, L) * LColor;
  if (d < 0.001) {
    const vec3 color1 = vec3(0.3, 0.28, 0.8);
    const vec3 color2 = vec3(0.93, 0.93, 0.93);
    float percent = 1.0 - (gl_FragCoord.y / resolution.y);
    // vec3 color = vec3(0.93 + sin(time * 3.0) * 0.5, 0.27,0.7);
    gl_FragColor = vec4((color1 * percent + color2 * (1.0 - percent)) - I, 1.0);
  } else {
    gl_FragColor = vec4(0.0);
  }
}
