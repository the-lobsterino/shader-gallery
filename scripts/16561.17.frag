 #ifdef GL_ES
precision highp float;
precision highp int;
#endif

#define M_PI 3.141592653589793

// my default raymarcher without dealing with uvs but using the surfacePosition varying instead
// -- novalis

// added stateful navigation
// -- @paniq

uniform float time;
uniform sampler2D backbuffer;
uniform vec2 resolution;
uniform vec2 mouse;

mat4 mtx_cam;

vec3 mod289(vec3 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 mod289(vec4 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 permute(vec4 x) {
     return mod289(((x*34.0)+1.0)*x);
}

vec4 taylorInvSqrt(vec4 r)
{
  return 1.79284291400159 - 0.85373472095314 * r;
}

float snoise(vec3 v)
  { 
  const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
  const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

// First corner
  vec3 i  = floor(v + dot(v, C.yyy) );
  vec3 x0 =   v - i + dot(i, C.xxx) ;

// Other corners
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min( g.xyz, l.zxy );
  vec3 i2 = max( g.xyz, l.zxy );

  //   x0 = x0 - 0.0 + 0.0 * C.xxx;
  //   x1 = x0 - i1  + 1.0 * C.xxx;
  //   x2 = x0 - i2  + 2.0 * C.xxx;
  //   x3 = x0 - 1.0 + 3.0 * C.xxx;
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy; // 2.0*C.x = 1/3 = C.y
  vec3 x3 = x0 - D.yyy;      // -1.0+3.0*C.x = -0.5 = -D.y

// Permutations
  i = mod289(i); 
  vec4 p = permute( permute( permute( 
             i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
           + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

// Gradients: 7x7 points over a square, mapped onto an octahedron.
// The ring size 17*17 = 289 is close to a multiple of 49 (49*6 = 294)
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

  //vec4 s0 = vec4(lessThan(b0,0.0))*2.0 - 1.0;
  //vec4 s1 = vec4(lessThan(b1,0.0))*2.0 - 1.0;
  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

  vec3 p0 = vec3(a0.xy,h.x);
  vec3 p1 = vec3(a0.zw,h.y);
  vec3 p2 = vec3(a1.xy,h.z);
  vec3 p3 = vec3(a1.zw,h.w);

//Normalise gradients
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;

// Mix final noise value
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), 
                                dot(p2,x2), dot(p3,x3) ) );
  }


mat3 rotation(float angle, vec3 axis) {
        float c = cos(angle);
        float s = sin(angle);
        
        vec3 a = normalize(axis);
        vec3 t = axis * (1.0 - c);
	
	vec3 u = s*a;
        
        return mat3(
	    //dot(t.xxx,a) + vec3(c, u.z, -u.y),
	    //dot(t.yyy,a) + vec3(-u.z, c, u.x),
	    //dot(t.zzz,a) + vec3(u.y, -u.x, c));
            c + t.x * a.x,      t.x * a.y + s * a.z, t.x * a.z - s * a.y,
            t.y * a.x - s * a.z,      c + t.y * a.y, t.y * a.z + s * a.x,
            t.z * a.x + s * a.y, t.z * a.y - s * a.x,      c + t.z * a.z);
}
		
float sdf_repeat(float x, float d) {
    return mod(x+d*0.5,d)-d*0.5;
}

vec3 sdf_repeat(vec3 x, vec3 d) {
    return mod(x+d*0.5,d)-d*0.5;
}

float sdf_torus(vec3 p, float inner_radius, float outer_radius) {
    vec2 q = vec2(length(p.xy) - outer_radius, p.z);
    return length(q)-inner_radius;
}

float sphere(in vec3 p, float r) {
	return length(p) - r;
}

float scene(in vec3 p) {
	p = vec3(mtx_cam * vec4(p,1.0));
	
	float ls = snoise((p+vec3(0.0,time*2.0,0.0))/50.0)*10.0 + p.y*0.1 + 5.0;
	ls = max(ls, -sdf_torus(p.xzy + vec3(0.0,0.0,100.0), 10.0, 50.0));
	ls += snoise(p)*0.1;
	
	float d = max(sdf_torus(sdf_repeat(p,vec3(2.0,2.0,1.0)), 0.1, 0.5), sphere(p, 10.0));
	d = min(d, ls);
	return d;
}

float calcAO(vec3 p, vec3 n, float radius) {
    float s = radius/3.0;
    float ao = 0.0;
    for (int i = 1; i <= 3; ++i) {
        float dist = s * float(i);
    float t = scene(p + n*dist);
        ao += max(0.0, (dist - t) / dist);
    }
    return 1.0 - (ao/3.0);
}

vec3 calcN(in vec3 p) {
	float e = 1e-3;
	return normalize(vec3(
		scene(vec3(p.x+e,p.y,p.z))-scene(vec3(p.x-e,p.y,p.z)),
		scene(vec3(p.x,p.y+e,p.z))-scene(vec3(p.x,p.y-e,p.z)),
		scene(vec3(p.x,p.y,p.z+e))-scene(vec3(p.x,p.y,p.z-e))
	));
}

float softshadow( in vec3 ro, in vec3 rd, float mint, float k )
{
    float res = 1.0;
    float t = mint;
    for( int i=0; i<16; i++ )
    {
        float h = scene(ro + rd*t);
        res = min( res, k*h/t );
        t += clamp( h, 0.04, 0.1 );
    }
    return clamp(res,0.0,1.0);
}

vec3 raytrace(in vec3 ro, in vec3 rd) {
	float d = 0.; float md = 100.;
	bool i = false;
	for (int s=0;s<64;s++) {
		float td = scene(ro + d*rd);
		if (td < 1e-3) break;
		if (d > md) return vec3(0);
		d += td;
	}
	return ro + d*rd;   // intersection
}

#define WRITE_VEC4(I,V) if (x==I) { gl_FragColor = V; return; }

vec4 store_u32(int i) {
	return vec4(mod(float(i),256.0),mod(float(i/256),256.0),mod(float(i/(256*256)),256.0),mod(float(i/(256*256*256)),256.0)) / 255.0;
}

int load_u32(vec4 v) {
	v = v*255.0;	
	return int(v.x) + int(v.y)*256 + int(v.z)*256*256 + int(v.w)*256*256*256;
}

vec4 store_snf32(float f) {
	return store_u32(int((f*0.5+0.5)*2147483648.0));
}

float load_snf32(vec4 v) {
	return (float(load_u32(v))/2147483648.0)*2.0-1.0;
}

vec4 read_vec4(int x) {
	// (2i + 1)/(2N)
	return texture2D(backbuffer,vec2(float(2*x+1)/(2.0*resolution.x),0.0));
}

float aspect = resolution.x / resolution.y;

vec2 n2s(vec2 v) {
	v = v*2.0-1.0;
	v.x *= aspect;
	return v;
}

#define VERSION 1.0

vec3 hue2rgb(float hue) {
    return clamp( 
        abs(mod(hue * 6.0 + vec3(0.0, 4.0, 2.0), 6.0) - 3.0) - 1.0, 
        0.0, 1.0);
}

vec3 hsl2rgb(vec3 c) {
    vec3 rgb = hue2rgb(c.x);
    return c.z + c.y * (rgb - 0.5) * (1.0 - abs(2.0 * c.z - 1.0));
}

vec3 ff_filmic_gamma3(vec3 linear) {
    vec3 x = max(vec3(0.0), linear-0.004);
    return (x*(x*6.2+0.5))/(x*(x*6.2+1.7)+0.06);
}

#define RANGE 1000.0
#define TIMERES 100.0

void main(void) {
	
	vec2 uv = gl_FragCoord.xy / resolution.xy;
	vec2 uvs = n2s(uv);
	
	vec3 color = vec3(.012,.01,.008); // some background
	
	vec3 campos = vec3(0.0,20.0,20.0);
	vec3 camdir = vec3(0.0,0.0,1.0);
	vec3 camup = vec3(0.0,1.0,0.0);
	
	float lasttime = time;
	
	vec4 state = read_vec4(0);
	if (state.x != VERSION) { // clear
		state.x = VERSION;
	} else {
		campos.x = load_snf32(read_vec4(1))*RANGE;
		campos.y = load_snf32(read_vec4(2))*RANGE;
		campos.z = load_snf32(read_vec4(3))*RANGE;
		camdir.x = load_snf32(read_vec4(4));
		camdir.y = load_snf32(read_vec4(5));
		camdir.z = load_snf32(read_vec4(6));
		camup.x = load_snf32(read_vec4(7));
		camup.y = load_snf32(read_vec4(8));
		camup.z = load_snf32(read_vec4(9));
		lasttime = float(load_u32(read_vec4(10)))/TIMERES; 
	}
	
	float td = max(0.0, time - lasttime);
	
	vec2 m = n2s(mouse);
	
	float yaw = sign(m.x)*max(0.0,abs(m.x)-0.1)*20.0*td;
	float pitch = sign(m.y)*max(0.0,abs(m.y)-0.1)*20.0*td;
	
	
	
	//camyaw = mod(camyaw - sign(m.x)*max(0.0,abs(m.x)-1.0)*0.005, 1.0);

	vec3 right = cross(camup, camdir);

	mtx_cam = mat4(
		vec4(right,0.0),
		vec4(camup,0.0),
		vec4(camdir,0.0),
		vec4(campos,1.0));

	if (int(gl_FragCoord.y) == 0) {
		campos -= camdir*4.0*td;

		int x = int(gl_FragCoord.x);
		
		if (x == 0) {
			if (scene(vec3(0.0,0.0,0.0)) < 0.0)
				state.x = 0.0;
		} else if ((x >= 4) && (x <= 9)) {
			mat3 rot = rotation(yaw*-0.05, camup) * rotation(pitch*0.05, right);
			
			camdir = rot * camdir;
			camup = rot * camup;
		}
		
		WRITE_VEC4(0,state);
		WRITE_VEC4(1,store_snf32(campos.x/RANGE));
		WRITE_VEC4(2,store_snf32(campos.y/RANGE));
		WRITE_VEC4(3,store_snf32(campos.z/RANGE));
		WRITE_VEC4(4,store_snf32(camdir.x));
		WRITE_VEC4(5,store_snf32(camdir.y));
		WRITE_VEC4(6,store_snf32(camdir.z));
		WRITE_VEC4(7,store_snf32(camup.x));
		WRITE_VEC4(8,store_snf32(camup.y));
		WRITE_VEC4(9,store_snf32(camup.z));
		WRITE_VEC4(10,store_u32(int(time*TIMERES)));
		gl_FragColor = vec4(0,0,0,0); return;
	}

	vec3 ro = vec3(uvs,0.0); vec3 rd = normalize(vec3(uvs,-1));
	vec3 ip = raytrace(ro, rd);
	
	vec3 ld = vec3(0.0,1.0,0.0);
	
	mat3 mtx_cam_inv = mat3(
		mtx_cam[0][0],mtx_cam[1][0],mtx_cam[2][0],
		mtx_cam[0][1],mtx_cam[1][1],mtx_cam[2][1],
		mtx_cam[0][2],mtx_cam[1][2],mtx_cam[2][2]);
	
	if (abs(ip.z) > 0.) { // we hit something, do lighting
		vec3 n = calcN(ip);
		vec3 nd = mat3(mtx_cam) * n;
		float ao = calcAO(ip, n, 0.5);
		vec3 p = vec3(mtx_cam * vec4(ip,1.0));
		
		float lt = 0.1 + 0.9*softshadow(ip, mtx_cam_inv * ld, 0.5, 10.0);
		color = vec3(0.1*ao + max(0.0, dot(nd, ld))*lt);
		vec3 hsl = vec3(atan(p.x,p.z)/(2.0*M_PI), 1.0, sin(p.y*0.1)*0.5+0.5);
		
		color *= hsl2rgb(hsl);
	}
	
	color = ff_filmic_gamma3(color * 2.0);
	color = clamp(color, 0.0, 1.0);
	
	gl_FragColor = vec4(color, 1);
}