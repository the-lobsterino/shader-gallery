#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

struct Ray {		/* 光線（位置ベクトル, 方向ベクトル） */
	vec3 o; vec3 d;
};

struct Light {		/* 光源(位置, 明るさ) */
	vec3 pos; float power;
};
	
struct HitInfo {		/* 衝突データ(交差の有無, 衝突点, 法線) */
	bool ishit; vec3 point; vec3 normal;
};

struct Sphere {		/* 球(中心, 半径, 色) */
	vec3 o; float r; vec3 color;
};



HitInfo InterSection(Ray ray, Sphere sphere) {		/* 交差判定(光線, 球{ターゲット}) -> 返り値衝突データ */
	HitInfo hitinfo;
	
	vec3 rc = ray.o - sphere.o;		/* 光線の位置から球{ターゲット}の中心位置へのベクトルrcを計算 */
	float a = dot(ray.d, ray.d);		/* a <- ray.dとray.dの内積を計算（二乗） */
	float b = dot(rc, ray.d);			/* b <- ベクトルrcとベクトルray.dの内積を計算 */
	float c = dot(rc, rc) - sphere.r * sphere.r;		/* c <- rcの二乗から球の直径の二乗を引く（） */
	float D = b * b - a * c;			/*  */
	if (D < 0.0) {				/* 交差なし */
		hitinfo.ishit = false;	/* 交差なしなので、hitinfo.ishitにfalseをセットし、返す */
		return hitinfo;
	}
	/* 前後判定 */
	float t = (-b - sqrt(D)) / a;		/* p = o + td; tを計算 */
	hitinfo.ishit = true;					/* 交差しているのでtrue */
	hitinfo.point = ray.o + ray.d * t;	/* 交差点はray.o + ray.d * t */
	hitinfo.normal = normalize(hitinfo.point - sphere.o);	/* 交差点における球の法線は、{交差点から球へのベクトル}を正規化したもの */
	
	return	hitinfo;
}

vec3 Lambert(HitInfo hitinfo, Sphere sphere, Light light) {	/* 交差情報hitinfoと球データsphere、光源データlightを受け取って、3要素ベクトルを返す */
	if (hitinfo.ishit) 	{		/* 交差している場合、{交差点の法線}と{光源位置から交差点を結んだベクトル}の内積と球の色と光源出力の積を返す */
		return dot(hitinfo.normal, light.pos - hitinfo.point) * sphere.color * light.power;
	} else {		/* 交差が無ければ(0..0, 0.0, 0.0)を返す */
		return vec3(0.0);	
	}
}

/* MAIN MAIN MAIN  */

void main( void ) {
	vec3 eye_pos = vec3(0.0, 0.0, -2.0);	/*  カメラ位置指定 */

	vec2 uv = (2.0 * gl_FragCoord.xy - resolution.xy) / min(resolution.x, resolution.y);
	Sphere sphere;
	sphere.o = vec3(0.0);
	sphere.r = 1.0;
	sphere.color = vec3(1.0);
	
	Light light;
	light.pos = vec3(mouse.x-0.5, mouse.y-0.5, -2.0);
	light.power = 0.55;
	
	Ray ray;
	ray.o = eye_pos;
	ray.d = normalize(vec3(uv, 1.0));
	
	
	gl_FragColor = vec4(Lambert(InterSection(ray, sphere), sphere, light), 0);
}
