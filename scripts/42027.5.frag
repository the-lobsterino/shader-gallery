#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

#define M_PI 3.1415926535897932384626433832795
#define TOLERANCE 5.0
#define NOISE_SCALE 0.002
#define TIME_SCALE 0.25
#define STEP_COUNT 100
#define STEP_SIZE 20.
#define SEED_COUNT 20

vec4 off = vec4(0.0);
const vec4 on = vec4(0.1, 0.5, 1.0, 1.0);

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec2 seeds[SEED_COUNT];

// SHADER
// Author: JanPer

// SIMPLEX NOISE
//      Author : Ian McEwan, Ashima Arts.


vec3 mod289(vec3 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 mod289(vec4 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 permute(vec4 x) {
     return mod289(((x*34.0)+1.0)*x);
}

vec4 taylorInvSqrt(vec4 r) {
  return 1.79284291400159 - 0.85373472095314 * r;
}

float snoise(vec3 v)
  { 
  const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
  const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i  = floor(v + dot(v, C.yyy) );
  vec3 x0 =   v - i + dot(i, C.xxx) ;
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min( g.xyz, l.zxy );
  vec3 i2 = max( g.xyz, l.zxy );
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = mod289(i); 
  vec4 p = permute( permute( permute( 
             i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
           + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
  float n_ = 0.142857142857; // 1.0/7.0
  vec3  ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);  //  mod(p,7*7)
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)
  vec4 x = x_ *ns.x + ns.yyyy;
  vec4 y = y_ *ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4( x.xy, y.xy );
  vec4 b1 = vec4( x.zw, y.zw );
  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
  vec3 p0 = vec3(a0.xy,h.x);
  vec3 p1 = vec3(a0.zw,h.y);
  vec3 p2 = vec3(a1.xy,h.z);
  vec3 p3 = vec3(a1.zw,h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;

  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), 
                                dot(p2,x2), dot(p3,x3) ) );
}

vec2 rotate(vec2 v, float a) {
	float s = sin(a);
	float c = cos(a);
	mat2 m = mat2(c, -s, s, c);
	return m * v;
}

float dist_to_line(vec2 pt, vec2 ln_start, vec2 ln_end) {
        float t = ((pt.x - ln_start.x) * (ln_end.x - ln_start.x))
            + (((pt.y - ln_start.y) * (ln_end.y - ln_start.y)))
            / (((ln_end.x - ln_start.x) * (ln_end.x - ln_start.x))
                + ((ln_end.y - ln_start.y) * (ln_end.y - ln_start.y)));
        float x = ln_start.x + t * (ln_end.x - ln_start.x);
        float y = ln_start.y + t * (ln_end.y - ln_start.y);
	
	vec2 pulled_point;

        if (t <= 0.0) {
            pulled_point = ln_start;
        } else {
            if (t >= 1.0) {
                pulled_point = ln_end;
            } else {
                pulled_point = vec2(x, y);
            }
        }
	return distance(pulled_point, pt);
}

vec2 jump(vec2 pos, float step, float time){
	return pos + rotate(vec2(step, 0.0), (snoise(vec3(pos * NOISE_SCALE, time * TIME_SCALE)) * M_PI * 2.0));
}

void init_seeds(){
	seeds[0] = vec2(100.0,200.0);
	seeds[1] = vec2(200.0,300.0);
	seeds[2] = vec2(1050.0,450.0);
	seeds[3] = vec2(400.0,600.0);
	seeds[4] = vec2(1500.0,100.0);
	seeds[5] = vec2(1000.0,500.0);
	seeds[6] = vec2(1500.0,700.0);
	seeds[7] = vec2(750.0,100.0);
	seeds[8] = vec2(2000.0,600.0);
	seeds[9] = vec2(2500.0,900.0);
	seeds[10] = vec2(1000.0,200.0);
	seeds[11] = vec2(1200.0,300.0);
	seeds[12] = vec2(50.0,450.0);
	seeds[13] = vec2(1400.0,600.0);
	seeds[14] = vec2(500.0,100.0);
	seeds[15] = vec2(0.0,500.0);
	seeds[16] = vec2(500.0,700.0);
	seeds[17] = vec2(1750.0,100.0);
	seeds[18] = vec2(1000.0,600.0);
	seeds[19] = vec2(1500.0,900.0);
}

void main(){
	init_seeds();
	vec2 curr_pos = gl_FragCoord.xy;
	off = vec4((snoise(vec3(curr_pos * NOISE_SCALE, time * TIME_SCALE))));
	gl_FragColor = off;
	bool break_me = false;
	for( int i = 0; i < STEP_COUNT; i++){
		vec2 next_pos = jump(curr_pos, STEP_SIZE, time * TIME_SCALE);
		for (int j = 0; j < SEED_COUNT; j++){
			float curr_dist = dist_to_line(seeds[j], curr_pos, next_pos);
			if ( curr_dist < TOLERANCE){
				gl_FragColor = mix (on, off, (curr_dist / TOLERANCE) * (float(i) / float(STEP_COUNT)));
				// gl_FragColor = on;
				break_me = true;
				break;
			}			
		}
		if (break_me)  {
			break;
		}
		curr_pos = next_pos;
	}
	//gl_FragColor = vec4(snoise(vec3(gl_FragCoord.xy * NOISE_SCALE, time * TIME_SCALE)));
}
