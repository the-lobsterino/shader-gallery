#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 resolution;

const int raytraceDepth = 8;
int seed = 0;

    struct Ray {
        vec3 org;
        vec3 dir;
    };
    
    struct Sphere {
        vec3 c;     // 球の位置 → 中心
        float r;    // 球の半径
        vec3 col;   //　色
    };

    struct Plane {
        vec3 p;     // rayと床との交点
        vec3 n;     // サンプル点の法線
        vec3 col;   // サンプル点の色
    };

    struct Intersection {
        float t;    // ヒットした距離
        vec3 p;     // 当たった点
        vec3 n;     // 法線
        int hit;    // ヒットしたかどうか
        vec3 col;   // ヒットしたオブジェクトの色
    };

Sphere sphere[3];
Plane plane;

float random() {
	seed = int(mod(float(seed)*1364.0+626.0, 509.0));
	return float(seed)/509.0;
}

void sphere_intersect(Sphere s, Ray ray, inout Intersection isect) {
    vec3 rs = ray.org - s.c;
    float b = dot(rs, ray.dir);
    float c = dot(rs, rs) - (s.r * s.r);
    float d = b * b - c;

    if (d > 0.0) {
        float t = -b - sqrt(d);
        if ((t > 0.0) && (t < isect.t)) {
            isect.t = t;
            isect.hit = 1;

            // 法線の計算
            vec3 p = vec3(ray.org.x + ray.dir.x * t,
                          ray.org.y + ray.dir.y * t,
                          ray.org.z + ray.dir.z * t);
            
            vec3 n = normalize(p - s.c);
            isect.n = n;
            isect.p = p;
            isect.col = s.col;
        }
    }
}

void plane_intersect(Plane pl, Ray ray, inout Intersection isect) {
    float d = -dot(pl.p, pl.n);
    float v = dot(ray.dir, pl.n);

    if (abs(v) < 1.0e-6) {
        return;     // rayと平面が並行 → ぶつからない
    }
    float t = -(dot(ray.org, pl.n) + d) / v;

    if ((t > 0.0) && (t < isect.t)) {
        isect.hit = 1;
        isect.t = t;
        isect.n = pl.n;

        vec3 p = vec3(ray.org.x + t * ray.dir.x,
                      ray.org.y + t * ray.dir.y,
                      ray.org.z + t * ray.dir.z);
        
        isect.p = p;
        float offset = 0.2;
        vec3 dp = p + offset;
        if ((mod(dp.x, 1.0) > 0.5 && mod(dp.z, 1.0) > 0.5)
        ||  (mod(dp.x, 1.0) < 0.5 && mod(dp.z, 1.0) < 0.5)) {
            isect.col = pl.col;
        }
        else {
            isect.col = pl.col * 1.5;
        }
    }
}

void Intersect(Ray r, inout Intersection i) {
    for (int c = 0; c < 3; c++)
    {
        sphere_intersect(sphere[c], r, i);
    }
    plane_intersect(plane, r, i);
}



vec3 computeLightShadow(in Intersection isect) {
	
	int i, j;
    	int ntheta = 16;
    	int nphi   = 16;
    	float eps  = 0.0001;

    	vec3 p = vec3(isect.p.x + eps * isect.n.x,
                  isect.p.y + eps * isect.n.y,
                  isect.p.z + eps * isect.n.z);

	vec3 lightPoint = vec3(4.0 * sin(time), 5.0, 4.0 * cos(time) + -3.0);
    	Ray ray;
	ray.org = p;
	ray.dir = normalize(lightPoint - p);

	Intersection lisect;
	lisect.hit = 0;
	lisect.t = 1.0e+30;
	lisect.n = lisect.p = lisect.col = vec3(0.0);
	Intersect(ray, lisect);
	if (lisect.hit != 0)
		return vec3(0.);
	else
	{
		float shade = max(0.0, dot(isect.n, ray.dir));
		shade = pow(shade,3.0) + shade * 0.3;
		return vec3(shade);
	}
	
}

void main () {
		

    	sphere[0].c   = vec3(-2.0, 0.0, -3.5);
    	//sphere[0].c   = vec3(0.0, cos(iTime) + 1.0, sin(iTime) - 3.0);
    	sphere[0].r   = 0.5;
    	sphere[0].col = vec3(1,0.3,0.3);

    	sphere[1].c   = vec3(-0.5, 0.0, -3.0);
    	//sphere[1].c   = vec3(cos(iTime), cos(iTime + 1.5) + 1.0, -3.0);
    	sphere[1].r   = 0.5;
    	sphere[1].col = vec3(0.3,1,0.3);

    	sphere[2].c   = vec3(1.0, 0.0, -2.2);
    	sphere[2].r   = 0.5;
    	sphere[2].col = vec3(0.3,0.3,1);
	
    	plane.p = vec3(0,-0.5, 0);
	plane.n = vec3(0, 1.0, 0);
	plane.col = vec3(1,1, 1);
	//seed = int(mod(dir.x * dir.y * 4525434.0, 65536.0));
	
	Ray r;
	vec2 uv = (-1.0 + 2.0*gl_FragCoord.xy / resolution.xy) * vec2(resolution.x/resolution.y, 1.0);
 	vec3 ro = vec3(-0.5, 1.0, 0.0);
 	vec3 rd = normalize(vec3(uv, -1.0));
	r.org = ro;
	r.dir = rd;
	vec4 col = vec4(0, 0, 0, 1);
	float eps  = 0.0001;
	vec3 bcol = vec3(1, 1, 1);
	for (int j = 0; j < raytraceDepth; j++)
	{
		Intersection i;
		i.hit = 0;
		i.t = 1.0e+30;
		i.n = i.p = i.col = vec3(0, 0, 0);
			
		Intersect(r, i);
		if (i.hit != 0)
		{
			col.rgb += bcol * i.col * computeLightShadow(i);
			bcol *= i.col;
		}
		else
		{
			break;
		}
				
		r.org = vec3(i.p.x + eps * i.n.x,
					 i.p.y + eps * i.n.y,
					 i.p.z + eps * i.n.z);
		r.dir = reflect(r.dir, vec3(i.n.x, i.n.y, i.n.z));
	}
	gl_FragColor = vec4(vec3(col), 1.0);
}
