precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

struct Quaternion {
  float x;
  float y;
  float z;
  float w;
};

Quaternion identity() {
  return Quaternion(0.0, 0.0, 0.0, 1.0);
}

Quaternion axisAngle(vec3 axis, float radian) {
  vec3 naxis = normalize(axis);
  float h = 0.5 * radian;
  float s = sin(h);
  return Quaternion(naxis.x * s, naxis.y * s, naxis.z * s, cos(h));
}

Quaternion conjugate(Quaternion q) {
  return Quaternion(-q.x, -q.y, -q.z, q.w);
}

Quaternion add(Quaternion q1, Quaternion q2) {
  return Quaternion(
    q1.x + q2.x,
    q1.y + q2.y,
    q1.z + q2.z,
    q1.w + q2.w
  );
}

Quaternion sub(Quaternion q1, Quaternion q2) {
  return Quaternion(
    q1.x - q2.x,
    q1.y - q2.y,
    q1.z - q2.z,
    q1.w - q2.w
  );
}

Quaternion mul(Quaternion q, float f) {
  return Quaternion(f * q.x, f * q.y, f * q.z, f * q.w);
}

Quaternion mul(Quaternion q1, Quaternion q2) {
  return Quaternion(
    q2.w * q1.x - q2.z * q1.y + q2.y * q1.z + q2.x * q1.w,
    q2.z * q1.x + q2.w * q1.y - q2.x * q1.z + q2.y * q1.w,
    -q2.y * q1.x + q2.x * q1.y + q2.w * q1.z + q2.z * q1.w,
    -q2.x * q1.x - q2.y * q1.y - q2.z * q1.z + q2.w * q1.w
  );
}

float qdot(Quaternion q1, Quaternion q2) {
  return q1.x * q2.x + q1.y * q2.y + q1.z * q2.z + q1.w * q2.w;
}

float squareNorm(Quaternion q) {
  return q.x * q.x + q.y * q.y + q.z * q.z + q.w + q.w;
}

float norm(Quaternion q) {
  return sqrt(squareNorm(q));
}

Quaternion qinverse(Quaternion q) {
  Quaternion c = conjugate(q);
  float s = norm(q);
  return mul(c, 1.0 / s);
}

vec3 rotate(vec3 v, Quaternion q) {
  // norm of q must be 1.
  Quaternion vq = Quaternion(v.x, v.y, v.z, 0.0);
  Quaternion cq = conjugate(q);
  Quaternion mq = mul(mul(cq, vq), q);
  return vec3(mq.x, mq.y, mq.z);
}

Quaternion slerp(Quaternion q1, Quaternion q2, float t) {
  float cosine = qdot(q1, q2);
  if (cosine < 0.0) {
    cosine = qdot(q1, mul(q2, -1.0));
  }
  float r = acos(qdot(q1, q2));
  float is = 1.0 / sin(r);
  return add(
    mul(q1, sin((1.0 - t) * r) * is),
    mul(q2, sin(t * r) * is)
  );
}


float sdBox(vec3 p, vec3 b) {
  p = abs(p) - b;
  return length(max(p, 0.0)) + min(max(p.x, max(p.y, p.z)), 0.0);
}

float map(vec3 p) {
  Quaternion q1 = axisAngle(vec3(1.0, 1.0, 0.0), 0.84);
  Quaternion q2 = axisAngle(vec3(0.5, 0.2, 1.0), 4.32);
  Quaternion q = slerp(q1, q2, mouse.x);
  p = rotate(p, q);

  return sdBox(p, vec3(1.0, 1.5, 2.0));
}

vec3 calcNormal(vec3 p) {
  float d = 0.01;
  return normalize(vec3(
    map(p + vec3(d, 0.0, 0.0)) - map(p - vec3(d, 0.0, 0.0)),
    map(p + vec3(0.0, d, 0.0)) - map(p - vec3(0.0, d, 0.0)),
    map(p + vec3(0.0, 0.0, d)) - map(p - vec3(0.0, 0.0, d))
  ));
}

vec3 raymarch(vec3 ro, vec3 rd) {
  vec3 p = ro;
  for (int i = 0; i < 128; i++) {
    float d = map(p);
    p += d * rd;
    if (d < 0.01) {
        vec3 n = calcNormal(p);
        return n * 0.5 + 0.5;
    }
  }
}

void main(void) {
  vec2 st = (2.0 * gl_FragCoord.xy - resolution) / min(resolution.x, resolution.y);

  vec3 ro = vec3(0.0, 0.0, 10.0);
  vec3 ta = vec3(0.0);
  vec3 z = normalize(ta - ro);
  vec3 up = vec3(0.0, 1.0, 0.0);
  vec3 x = normalize(cross(z, up));
  vec3 y = normalize(cross(x, z));
  vec3 rd = normalize(x * st.x + y * st.y + z * 1.5);


  vec3 c = raymarch(ro, rd);

  gl_FragColor = vec4(c, 1.0);
}