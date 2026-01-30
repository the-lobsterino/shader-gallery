#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define SCALE 5e-10

#define Z_FROM -1.0
#define Z_TO 1.0
#define Z_STEP 0.05

#define A0 5.29e-12
#define E1 -2.179e-18

#define PI 3.141592653589793
#define R_A_PI_3 46370476168961640.0

void im_exp(float amp, float phase, out vec2 im) {
  im.x = cos(phase) * amp;
  im.y = sin(phase) * amp;
}


void wave_1s(vec3 pos, float t, out vec2 im) {
  float amp = R_A_PI_3 * exp(-pos.x / A0);
  float phase = E1 * t;

  im_exp(amp, phase, im);
}


void wave_2p(vec3 pos, float t, out vec2 im) {
  float amp = 1.0 / (sqrt(2.0) * 4.0 * A0);
  amp *= R_A_PI_3 * exp(-pos.x / (2.0 * A0));
  amp *= pos.x * cos(pos.y);

  float phase = E1 * t / 4.0;

  im_exp(amp, phase, im);
}


void draw(vec3 pos, float t, out vec2 i) {
  vec2 w1;
  wave_1s(pos, t, w1);

  vec2 w2;
  wave_2p(pos, t, w2);

  float c1 = sin(time);
  float c2 = cos(time);

  w1 *= c1;
  w2 *= c2;

  i = w1 + w2;
}


void main( void ) {
  float dim = min(resolution.x, resolution.y);
  vec2 pos = gl_FragCoord.xy / dim;
  pos.x -= resolution.x / (2.0 * dim);
  pos.y -= resolution.y / (2.0 * dim);

  float yz_ang = mouse.y * 2.0 * PI + time * 0.2;
  float xz_ang = mouse.x * 2.0 * PI + time * 0.15;

  mat3 rot_yz = mat3(
    vec3(1.0, 0.0, 0.0),
    vec3(0.0, cos(yz_ang), sin(yz_ang)),
    vec3(0.0, -sin(yz_ang), cos(yz_ang))
  );
  mat3 rot_xz = mat3(
    vec3(cos(xz_ang), 0.0, sin(xz_ang)),
    vec3(0.0, 1.0, 0.0),
    vec3(-sin(xz_ang), 0.0, cos(xz_ang))
  );
  mat3 rot = rot_yz * rot_xz;

  vec2 intensity = vec2(0.0, 0.0);
  for (float z = Z_FROM; z <= Z_TO; z += Z_STEP) {
    vec3 cart = vec3(pos, z);

    cart *= SCALE;
    cart *= rot;

    vec3 sph;
    sph.x = sqrt(cart.x * cart.x + cart.y * cart.y + cart.z * cart.z),
    sph.y = acos(cart.z / sph.x);
    sph.z = atan(cart.y / cart.x);

    vec2 i;
    draw(sph, time / E1, i);
    intensity += i * Z_STEP / (Z_TO - Z_FROM);
  }
  
  intensity /= R_A_PI_3 * 1e-4;
  intensity.x *= intensity.x;
  intensity.y *= intensity.y;
  gl_FragColor = vec4( vec3(intensity, 0.0), 1.0 );
}
