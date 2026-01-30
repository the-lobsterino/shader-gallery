precision highp float;
uniform vec2 resolution;
uniform float time;
uniform vec2 mouse;

/* z: pixel size */
vec3 aspect_ratio_1540259130(vec2 res, int iscover) {
  // iscover: 0 = contains, 1 = cover, 2 = stretch
  float r;
  vec3 ret = vec3((gl_FragCoord.xy / res.xy), 0.);
  if(iscover == 2) {
    ret.z = 1. / max(res.x, res.y);
  } else if(iscover == 0 ^^ res.x > res.y) {
    r = res.y / res.x;
    ret.y = ret.y * r - (r - 1.) * 0.5;
    ret.z = 1. / (iscover == 0 ? res.x : res.y);
  } else {
    r = res.x / res.y;
    ret.x = (ret.x * r) - (r - 1.) * 0.5;
    ret.z = 1. / (iscover == 0 ? res.y : res.x);
  } 
  return ret;
}

/*
ret.y = ret.y * res.y / res.x
ret.x = ret.x * res.x / res.x
ret.xy = ret.xy * res.yx / max(res.x, res.y)

float base;
base = res.xy / (iscover == 0 ? min(res.x, res.y) : max(res.x, res.y));
ret.z = 1. / base;
ret.xy = ( ret.xy * res.yx / base ) - ret.xy / base;
*/

float hash(float n) { return fract(sin(n) * 1e4); }
float hash(vec2 p) { return fract(1e4 * sin(17.0 * p.x + p.y * 0.1) * (0.1 + abs(sin(p.y * 13.0 + p.x)))); }

float noise(float x) {
        float i = floor(x);
        float f = fract(x);
        float u = f * f * (3.0 - 2.0 * f);
        return mix(hash(i), hash(i + 1.0), u);
}

float noise(vec2 x) {
        vec2 i = floor(x);
        vec2 f = fract(x);

        // Four corners in 2D of a tile
        float a = hash(i);
        float b = hash(i + vec2(1.0, 0.0));
        float c = hash(i + vec2(0.0, 1.0));
        float d = hash(i + vec2(1.0, 1.0));

        // Simple 2D lerp using smoothstep envelope between the values.
        // return vec3(mix(mix(a, b, smoothstep(0.0, 1.0, f.x)),
        //                      mix(c, d, smoothstep(0.0, 1.0, f.x)),
        //                      smoothstep(0.0, 1.0, f.y)));

        // Same code, with the clamps in smoothstep and common subexpressions
        // optimized away.
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

// This one has non-ideal tiling properties that I'm still tuning
float noise(vec3 x) {
        const vec3 step = vec3(110, 241, 171);

        vec3 i = floor(x);
        vec3 f = fract(x);
 
        // For performance, compute the base input to a 1D hash from the integer part of the argument and the 
        // incremental change to the 1D based on the 3D -> 1D wrapping
    float n = dot(i, step);

        vec3 u = f * f * (3.0 - 2.0 * f);
        return mix(mix(mix( hash(n + dot(step, vec3(0, 0, 0))), hash(n + dot(step, vec3(1, 0, 0))), u.x),
                   mix( hash(n + dot(step, vec3(0, 1, 0))), hash(n + dot(step, vec3(1, 1, 0))), u.x), u.y),
               mix(mix( hash(n + dot(step, vec3(0, 0, 1))), hash(n + dot(step, vec3(1, 0, 1))), u.x),
                   mix( hash(n + dot(step, vec3(0, 1, 1))), hash(n + dot(step, vec3(1, 1, 1))), u.x), u.y), u.z);
}

#define NUM_OCTAVES 5

float fbm(float x) {
  float v = 0.0;
  float a = 0.5;
  float shift = float(100);
  for (int i = 0; i < NUM_OCTAVES; ++i) {
    v += a * noise(x);
    x = x * 2.0 + shift;
    a *= 0.5;
  }
  return v;
}

float fbm(vec2 x) {
  float v = 0.0;
  float a = 0.5;
  vec2 shift = vec2(100);
  // Rotate to reduce axial bias
  mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.50));
  for (int i = 0; i < NUM_OCTAVES; ++i) {
    v += a * noise(x);
    x = rot * x * 2.0 + shift;
    a *= 0.5;
  }
  return v;
}

float fbm(vec3 x) {
  float v = 0.0;
  float a = 0.5;
  vec3 shift = vec3(100);
  for (int i = 0; i < NUM_OCTAVES; ++i) {
    v += a * noise(x);
    x = x * 2.0 + shift;
    a *= 0.5;
  }
  return v;
}

#define NUM_ITERATION 5.

float raster_cloud_1062606552(vec2 uv, float t, vec2 dir, float delta) {
  float c = 0.;
  for(float i=1.;i<NUM_ITERATION;i++) {
    c += fbm(vec2(uv.x * i + t * pow(delta,i) * 0.001 * dir.x, uv.y * i + t * pow(delta, i) * 0.001 * dir.y));
  }
  c = c / (NUM_ITERATION - 2.);
  return c;
}

float vignette(float max, float amount, vec2 uv_0) {
  return max - length(uv_0 - .5) * amount;
}

float distance_to_line_2281831123(vec2 p, vec2 a, vec2 b) {
  vec2 pa = p - a;
  vec2 n = b - a;
  return length(pa - clamp(dot(pa, n) / dot(n, n), 0., 1.) * n);
}

uniform float  connectivity, speed;

//uniform vec3 bg1, bg2, fg;

float line(vec2 p, vec2 a, vec2 b) {
  float d = distance_to_line_2281831123(p, a, b);
  return clamp(smoothstep(0.02, 0.0, d), 0.0, 0.9);
}

vec2 getpt(vec2 id, float t) {
  vec2 pt = vec2(noise(id.x + noise(id.y) * 625.788) * t, noise(id.y + noise(id.x) * 9527.145) * t);
  pt = vec2(cos(pt.x), sin(pt.y)) * 0.4;
  return pt;
}

void main() {
	float uTime = time;
	float size = abs(fract(time*.1)-.5)*4.;
	size = size*10. / (size+1.) + 1.;
	vec2 uResolution = resolution;
	
  float t = (uTime + 2586.9363) * 2. * speed, f, d;
  //vec3 uv3 = vec3( ( gl_FragCoord.xy / resolution ) ,1.) ;
  vec3 uv3 = aspect_ratio_1540259130(uResolution, 0);
  vec2 uv = fract(vec2(uv3) * size) - 0.5;
  vec2 id = floor(vec2(uv3) * size);
  vec2 pt1, pt2, pt3;
  vec2 p[9];
  for(float i=-1.;i<=1.;i+=1.) {
    for(float j=-1.;j<=1.;j+=1.) {
      p[int(i * 3. + j + 4.)] = getpt(id + vec2(i, j), t) + vec2(i, j);
    }
  }
  d = length(uv - p[4]);
  f = smoothstep(0.09, 0.08, d);
  for(float i=0.;i<9.;i++) {
    f += line(uv, p[4], p[int(i)]) * smoothstep(connectivity, 0.2, 0.4 * length(p[int(i)] - p[4]));
  }
  f += line(uv, p[1], p[3]) * smoothstep(connectivity, 0.2, 0.4 * length(p[3] - p[1]));
  f += line(uv, p[1], p[5]) * smoothstep(connectivity, 0.2, 0.4 * length(p[5] - p[1]));
  f += line(uv, p[7], p[3]) * smoothstep(connectivity, 0.2, 0.4 * length(p[3] - p[7]));
  f += line(uv, p[7], p[5]) * smoothstep(connectivity, 0.2, 0.4 * length(p[5] - p[7]));

  f = clamp(f, 0., 1.);
  vec3 bg = vec3(.0, 0., .0);
  float c = raster_cloud_1062606552(vec2(uv3), t * 100., vec2(1., 0.), 0.1) * 0.9;
  gl_FragColor = vec4(vec3(c), 0.1);


  vec3 bg1, bg2, fg;

  bg1.zx = 1.-uv3.xy;
  bg2.xy = uv3.xy;
  gl_FragColor = vec4(mix(mix(bg1, bg2, c), fg, f), 1.);

}

