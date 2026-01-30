/*
 * Original shader from: https://www.shadertoy.com/view/DdVXWc
 */

#ifdef GL_ES
precision highp float;
#endif

// glslsandbox uniforms
uniform float time;
uniform vec2 resolution;
uniform vec2 mouse;

// shadertoy emulation
#define iTime time
#define iResolution resolution
vec4 iMouse = vec4(0.);

// --------[ Original ShaderToy begins here ]---------- //
/*
based on 
https://www.shadertoy.com/view/4sfGDB
by Zavie

modified by Daniel Chin
*/

#define ENABLE_LOCAL_CONTINUITY

#define SAMPLES 4
#define MAXDEPTH 4
#define ENABLE_NEXT_EVENT_PREDICTION

// Uncomment to see how many samples never reach a light source
//#define DEBUG

#define PI 3.14159265359
#define DIFF 0
#define SPEC 1
#define REFR 2
#define NUM_SPHERES 9

float seed = 0.;
float rand() {
	return fract(sin(seed++)*43758.5453123);
}

//	Simplex 4D Noise 
//	by Ian McEwan, Ashima Arts
//
vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
float permute(float x){return floor(mod(((x*34.0)+1.0)*x, 289.0));}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
float taylorInvSqrt(float r){return 1.79284291400159 - 0.85373472095314 * r;}

vec4 grad4(float j, vec4 ip){
  const vec4 ones = vec4(1.0, 1.0, 1.0, -1.0);
  vec4 p,s;

  p.xyz = floor( fract (vec3(j) * ip.xyz) * 7.0) * ip.z - 1.0;
  p.w = 1.5 - dot(abs(p.xyz), ones.xyz);
  s = vec4(lessThan(p, vec4(0.0)));
  p.xyz = p.xyz + (s.xyz*2.0 - 1.0) * s.www; 

  return p;
}

float snoise(vec4 v){
  const vec2  C = vec2( 0.138196601125010504,  // (5 - sqrt(5))/20  G4
                        0.309016994374947451); // (sqrt(5) - 1)/4   F4
// First corner
  vec4 i  = floor(v + dot(v, C.yyyy) );
  vec4 x0 = v -   i + dot(i, C.xxxx);

// Other corners

// Rank sorting originally contributed by Bill Licea-Kane, AMD (formerly ATI)
  vec4 i0;

  vec3 isX = step( x0.yzw, x0.xxx );
  vec3 isYZ = step( x0.zww, x0.yyz );
//  i0.x = dot( isX, vec3( 1.0 ) );
  i0.x = isX.x + isX.y + isX.z;
  i0.yzw = 1.0 - isX;

//  i0.y += dot( isYZ.xy, vec2( 1.0 ) );
  i0.y += isYZ.x + isYZ.y;
  i0.zw += 1.0 - isYZ.xy;

  i0.z += isYZ.z;
  i0.w += 1.0 - isYZ.z;

  // i0 now contains the unique values 0,1,2,3 in each channel
  vec4 i3 = clamp( i0, 0.0, 1.0 );
  vec4 i2 = clamp( i0-1.0, 0.0, 1.0 );
  vec4 i1 = clamp( i0-2.0, 0.0, 1.0 );

  //  x0 = x0 - 0.0 + 0.0 * C 
  vec4 x1 = x0 - i1 + 1.0 * C.xxxx;
  vec4 x2 = x0 - i2 + 2.0 * C.xxxx;
  vec4 x3 = x0 - i3 + 3.0 * C.xxxx;
  vec4 x4 = x0 - 1.0 + 4.0 * C.xxxx;

// Permutations
  i = mod(i, 289.0); 
  float j0 = permute( permute( permute( permute(i.w) + i.z) + i.y) + i.x);
  vec4 j1 = permute( permute( permute( permute (
             i.w + vec4(i1.w, i2.w, i3.w, 1.0 ))
           + i.z + vec4(i1.z, i2.z, i3.z, 1.0 ))
           + i.y + vec4(i1.y, i2.y, i3.y, 1.0 ))
           + i.x + vec4(i1.x, i2.x, i3.x, 1.0 ));
// Gradients
// ( 7*7*6 points uniformly over a cube, mapped onto a 4-octahedron.)
// 7*7*6 = 294, which is close to the ring size 17*17 = 289.

  vec4 ip = vec4(1.0/294.0, 1.0/49.0, 1.0/7.0, 0.0) ;

  vec4 p0 = grad4(j0,   ip);
  vec4 p1 = grad4(j1.x, ip);
  vec4 p2 = grad4(j1.y, ip);
  vec4 p3 = grad4(j1.z, ip);
  vec4 p4 = grad4(j1.w, ip);

// Normalise gradients
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;
  p4 *= taylorInvSqrt(dot(p4,p4));

// Mix contributions from the five corners
  vec3 m0 = max(0.6 - vec3(dot(x0,x0), dot(x1,x1), dot(x2,x2)), 0.0);
  vec2 m1 = max(0.6 - vec2(dot(x3,x3), dot(x4,x4)            ), 0.0);
  m0 = m0 * m0;
  m1 = m1 * m1;
  return (
    49.0 * (
      dot(m0*m0, vec3( dot( p0, x0 ), dot( p1, x1 ), dot( p2, x2 )))
      + dot(m1*m1, vec2( dot( p3, x3 ), dot( p4, x4 ) ) ) 
    ) + 1.0
  ) * .5;

}

struct Ray { vec3 o, d; };
struct Sphere {
	float r;
	vec3 p, e, c;
	int refl;
};

Sphere lightSourceVolume = Sphere(20., vec3(50., 81.6, 81.6), vec3(12.), vec3(0.), DIFF);
Sphere spheres[NUM_SPHERES];
void initSpheres() {
	spheres[0] = Sphere(1e5, vec3(-1e5+1., 40.8, 81.6),	vec3(0.), vec3(.75, .25, .25), DIFF);
	spheres[1] = Sphere(1e5, vec3( 1e5+99., 40.8, 81.6),vec3(0.), vec3(.25, .25, .75), DIFF);
	spheres[2] = Sphere(1e5, vec3(50., 40.8, -1e5),		vec3(0.), vec3(.75), DIFF);
	spheres[3] = Sphere(1e5, vec3(50., 40.8,  1e5+170.),vec3(0.), vec3(0.), DIFF);
	spheres[4] = Sphere(1e5, vec3(50., -1e5, 81.6),		vec3(0.), vec3(.75), DIFF);
	spheres[5] = Sphere(1e5, vec3(50.,  1e5+81.6, 81.6),vec3(0.), vec3(.75), DIFF);
	spheres[6] = Sphere(16.5, vec3(27., 16.5, 47.), 	vec3(0.), vec3(1.), SPEC);
	spheres[7] = Sphere(16.5, vec3(73., 16.5, 78.), 	vec3(0.), vec3(.7, 1., .9), REFR);
	spheres[8] = Sphere(600., vec3(50., 681.33, 81.6),	vec3(12.), vec3(0.), DIFF);
}

float intersect(Sphere s, Ray r) {
	vec3 op = s.p - r.o;
	float t, epsilon = 1e-3, b = dot(op, r.d), det = b * b - dot(op, op) + s.r * s.r;
	if (det < 0.) return 0.; else det = sqrt(det);
	return (t = b - det) > epsilon ? t : ((t = b + det) > epsilon ? t : 0.);
}

int intersect(Ray r, out float t, out Sphere s, int avoid) {
	int id = -1;
	t = 1e5;
	s = spheres[0];
	for (int i = 0; i < NUM_SPHERES; ++i) {
		Sphere S = spheres[i];
		float d = intersect(S, r);
		if (i!=avoid && d!=0. && d<t) { t = d; id = i; s=S; }
	}
	return id;
}

vec3 jitter(vec3 d, float phi, float sina, float cosa) {
	vec3 w = normalize(d), u = normalize(cross(w.yzx, w)), v = cross(w, u);
	return (u*cos(phi) + v*sin(phi)) * sina + w * cosa;
}

vec3 radiance(int sample_i, vec2 fragPos, Ray r) {
	vec3 acc = vec3(0.);
	vec3 mask = vec3(1.);
	int id = -1;
	float it = iTime * .03;
	vec2 fp = fragPos * .1;
	for (int depth = 0; depth < MAXDEPTH; ++depth) {
    vec3 v3 = vec3(it, float(depth), float(sample_i));
		float t;
		Sphere obj;
		if ((id = intersect(r, t, obj, id)) < 0) break;
		vec3 x = t * r.d + r.o;
		vec3 n = normalize(x - obj.p), nl = n * sign(-dot(n, r.d));

		if (obj.refl == DIFF) {
#ifdef ENABLE_LOCAL_CONTINUITY
			float r2 = snoise(vec4(
				v3, 0
			));
			float sn5 = snoise(vec4(
				v3, 5.2348965984
			));
#else
			float r2 = rand();
			float sn5 = rand();
#endif
			vec3 d = jitter(nl, 2.*PI*sn5, sqrt(r2), sqrt(1. - r2));
			vec3 e = vec3(0.);
#ifdef ENABLE_NEXT_EVENT_PREDICTION
			//for (int i = 0; i < NUM_SPHERES; ++i)
			{
				// Sphere s = sphere(i);
				// if (dot(s.e, vec3(1.)) == 0.) continue;
				Sphere s = lightSourceVolume;
				int i = 8;

#ifdef ENABLE_LOCAL_CONTINUITY
				float sn10 = snoise(vec4(
					v3, 10.72309867
				));
				float sn20 = snoise(vec4(
					v3, 20.389287
				));
#else
        float sn10 = rand();
        float sn20 = rand();
#endif
				vec3 l0 = s.p - x;
				float cos_a_max = sqrt(1. - clamp(s.r * s.r / dot(l0, l0), 0., 1.));
				float cosa = mix(cos_a_max, 1., sn10);
				vec3 l = jitter(l0, 2.*PI*sn20, sqrt(1. - cosa*cosa), cosa);

				if (intersect(Ray(x, l), t, s, id) == i) {
					float omega = 2. * PI * (1. - cos_a_max);
					e += (s.e * clamp(dot(l, n),0.,1.) * omega) / PI;
				}
			}
#endif
			float E = 1.;//float(depth==0);
			acc += mask * obj.e * E + mask * obj.c * e;
			mask *= obj.c;
			r = Ray(x, d);
		} else if (obj.refl == SPEC) {
			acc += mask * obj.e;
			mask *= obj.c;
			r = Ray(x, reflect(r.d, n));
		} else {
			float a=dot(n,r.d), ddn=abs(a);
			float nc=1., nt=1.5, nnt=mix(nc/nt, nt/nc, float(a>0.));
			float cos2t=1.-nnt*nnt*(1.-ddn*ddn);
			r = Ray(x, reflect(r.d, n));
			if (cos2t>0.) {
				vec3 tdir = normalize(r.d*nnt + sign(a)*n*(ddn*nnt+sqrt(cos2t)));
				float R0=(nt-nc)*(nt-nc)/((nt+nc)*(nt+nc)),
					c = 1.-mix(ddn,dot(tdir, n),float(a>0.));
				float Re=R0+(1.-R0)*c*c*c*c*c,P=.25+.5*Re,RP=Re/P,TP=(1.-Re)/(1.-P);
#ifdef ENABLE_LOCAL_CONTINUITY
				float sn30 = snoise(vec4(
					v3, 30.01894375
				));
#else
        float sn30 = rand();
#endif
				if (sn30<P) { mask *= RP; }
				else { mask *= obj.c*TP; r = Ray(x, tdir); }
			}
		}
	}
	return acc;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
	initSpheres();
	seed = iTime + iResolution.y * fragCoord.x / iResolution.x + fragCoord.y / iResolution.y;
	vec2 uv = 2. * fragCoord.xy / iResolution.xy - 1.;
	vec3 camPos = vec3((2. * (iMouse.xy==vec2(0.)?.5*iResolution.xy:iMouse.xy) / iResolution.xy - 1.) * vec2(48., 40.) + vec2(50., 40.8), 169.);
	vec3 cz = normalize(vec3(50., 40., 81.6) - camPos);
	vec3 cx = vec3(1., 0., 0.);
	vec3 cy = normalize(cross(cx, cz)); cx = cross(cz, cy);
	vec3 color = vec3(0.);
	for (int i = 0; i < SAMPLES; ++i) {
#ifdef DEBUG
    vec3 test = radiance(i, fragCoord.xy / iResolution.xy, Ray(camPos, normalize(.53135 * (iResolution.x/iResolution.y*uv.x * cx + uv.y * cy) + cz)));
    if (dot(test, test) > 0.) color += vec3(1.); else color += vec3(0.5,0.,0.1);
#else
    color += radiance(i, fragCoord.xy / iResolution.xy, Ray(camPos, normalize(.53135 * (iResolution.x/iResolution.y*uv.x * cx + uv.y * cy) + cz)));
#endif
  }
  const vec4 accum = vec4(0,0,0,0);
  float samples = accum.a + float(SAMPLES);
  fragColor = vec4((accum.rgb * accum.a + color)/samples, samples);
}

// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    iMouse = vec4(mouse * resolution, 0., 0.);
    mainImage(gl_FragColor, gl_FragCoord.xy);
    gl_FragColor.a = 1.;
}