#extension GL_OES_standard_derivatives : enable

#define EPS 10e-3
#define FAR 10e+6

precision mediump float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float random (in vec2 _st) {
    return fract(sin(dot(_st.xy,
                         vec2(12.9898,78.233)))*
        43758.5453123);
}
mat2 rot2D(float angle){
	return mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
}
mat2 scale2D(vec2 sc){
    return mat2(sc.x, 0.0, 0.0, sc.y);
}
vec2 rot2DPt(vec2 p, vec2 q, float angle){
	vec2 d = q - p;
	p += d;
	p *= rot2D(angle);
	p -= d;
	return p;
}
vec2 scale2DPt(vec2 uv, vec2 p, vec2 s){
	vec2 d = uv - p;
	p += d;
    	p *= scale2D(s);
	p -= d;
	return p;
}
float box(vec2 p, float w, float h){
	float b = smoothstep(w*0.5+0.01, w*0.5, abs(p.x));
	b *= smoothstep(h*0.5+0.01, h*0.5, abs(p.y));
	return b;
}

vec3 draw01(vec2 uv){
	vec2 p = vec2(0.0);
	vec3 col = vec3(0.0);

	// orb
	p = uv - vec2(0.2, 0.1);
	//p = rot2DPt(p, uv - vec2(0.0, 0.0), t);
	//p = scale2DPt(uv, p, vec2(1.0, 1.0));
	
	//col += 0.01 / length(p);
	p *= scale2D(vec2(2.0, 1.0));
	col = vec3(1.0) * box(p, 0.1, 0.05);

	// coord axis
	if (abs(uv.x) <= 0.003 || abs(uv.y) <= 0.003) { col = vec3(0.5); }
	if (distance(uv, vec2(0.2, 0.1)) < 0.012){ col = vec3(1.0, 0.6, 0.6); }
	return col;
}

vec3 draw02(vec2 uv){
	vec2 p = vec2(0.0);
	vec3 col = vec3(0.0);
	float t = time * 0.5;
	
	p = uv;
	float dir = -1. * random(floor(p.yy * 200.));
	dir = 0.5 +  dir;
	p.x = p.x + t * dir;
	vec2 q = p;
	q = vec2(floor(q.x * 10.), q.y);
	col = vec3(0.4) * random(q);
	
	return col;
}

vec3 draw03(vec2 uv){
	vec2 p = uv;
	vec3 col = vec3(0.0);
	float t = time * .81;	

	p = vec2(sin(p.x), p.y + sin(p.x + 1.5 * t) *.15);
	p = p / length(p) - vec2(1./length(p), 0.0);
	float c = random(floor(p * 10.0));
	col = vec3(1.0) * .5 *c;
	
	return col;
}
float noise (in vec2 _st) {
    vec2 i = floor(_st);
    vec2 f = fract(_st);

    // Four corners in 2D of a tile
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    vec2 u = f * f * (3.0 - 2.0 * f);

    return mix(a, b, u.x) +
            (c - a)* u.y * (1.0 - u.x) +
            (d - b) * u.x * u.y;
}
float fbm ( in vec2 _st) {
    float v = 0.0;
    float a = 0.5;

    vec2 shift = vec2(100.0);
    // Rotate to reduce axial bias
    mat2 rot = mat2(cos(0.5), sin(0.5),
                    -sin(0.5), cos(0.50));
    for (int i = 0; i < 5; ++i) { // octave =5
        v += a * noise(_st);
        _st = rot * _st * 2.0 + shift;
        a *= 0.5;
    }
    return v;
}
vec3 draw04(vec2 uv){
	vec2 p = uv;
	vec3 col = vec3(0.0);
	float t = time * 1.1;

	p.x = fbm(uv + 0.10 * t);
    	p.y = fbm(uv + vec2(1.0));
	
	vec2 q = vec2(0.);
    	q.x = fbm(uv + 1.0 * p + vec2(1.7, 9.2)+ 0.15 * t);
    	q.y = fbm(uv + 1.0 * p + vec2(8.3, 2.8)+ 0.126 * t);

    	float f = fbm(uv + q);
	
	col = vec3(clamp(f, .0, 1.0), length(q), length(p));
	col = vec3(f*3.);
	
	/*col = mix(vec3(0.101961, 0.619608, 0.666667),
                    vec3(0.666667, 0.666667, 0.498039),
                    clamp((f * f) * 4.0, 0.0, 1.0));
	col = mix(col, vec3(0,0,0.164706), clamp(length(p), 0.0, 1.0));
	col = mix(col, vec3(0.666667,1,1), clamp(length(q.x), 0.0, 1.0));
	*/
	return col;
}
float getseg(vec2 p, float w){
	float b = 0.4;
	float f = b / abs(p.y);
	f *= step(0.0, p.x) * step(p.x, w);
	f *= step(0.0, p.x + p.y) * step(0.0, p.x - p.y);
	p.x -= w;
	f *= step(p.x - p.y, 0.0) * step(p.x + p.y, 0.0);
	f = step(0.5, smoothstep(0.01, 1.0, f * .01));
	return f;
}
vec3 draw05(vec2 uv){
	vec3 col = vec3(0.0);
	
	vec2 p = uv;
	float w = 0.1;
	
	float f = getseg(p, w);
	p -= vec2(-0.005, 0.005);
	f = max(f, getseg(p.yx, w));
	p -= vec2(0.105, 0.0);
	f = max(f, getseg(p.yx, w));
	p -= vec2(-0.103, 0.105);
	f = max(f, getseg(p, w));
	
	col = vec3(1.0) * f;
	return col;
}
float getPattern(in vec2 uv, int pattype, in float sz){
  float f = 0.0;
  float k = 1.0; // repetition
  vec2 p = uv;

  if (pattype == 1) {
    // circle
    k = 1.0 / sz;
    p = 2.0 * fract(uv * k) - 1.0;
    f = 1.0 / length(p);
  } else if (pattype == 2) {
    // checker board
    k = 0.5 / sz;
    p = 2.0 * fract(uv * k) - 1.0;
    f = step(p.x, 0.0) + step(p.y, 0.0);
    f = abs(f - 1.0);
  } else if (pattype == 3){
    // check
    k = 0.25 / sz;
    p = 2.0 * fract(uv * k) - 1.0;
    f = step( fract(p.x), 0.5) + step( fract(p.y), 0.5);  
  } else if (pattype == 4){
    // tile 
    k = 0.5 * sz;
    p = 2.0 * fract(uv * k) - 1.0;
    p = abs(p);
    f = 1.0 - step(0.5, sin(p.x)) * step(0.5, sin(p.y));
  }
    
  return f;
}
float sdPlane( vec3 p ){
	return p.y;
}
float sdSphere( vec3 p, float s ){
    return length(p)-s;
}
float sdBox( vec3 p, vec3 b ){
    vec3 d = abs(p) - b;
    return min(max(d.x,max(d.y,d.z)),0.0) + length(max(d,0.0));
}
vec2 map(in vec3 p){
	vec2 res = vec2( 1e10, 0.0);
	
	res.x = min(res.x, sdSphere(p, 0.5));
	
	return res;
}
vec3 calcNormal( in vec3 p){
    vec2 e = vec2(.2,-.2);
    return normalize( e.xyy*map( p + e.xyy ).x + 
					  e.yyx*map( p + e.yyx ).x + 
					  e.yxy*map( p + e.yxy ).x + 
					  e.xxx*map( p + e.xxx ).x );
}
float calcShadow(in vec3 ro, in vec3 rd){
    float h = 0.0;
    float c = 0.001;
    float r = 1.0;
    float shadowCoef = 0.5;

    for (float t = 0.0; t < 32.0; t+=1.0){
        vec2 res = map(ro + rd * c);
        if(res.x < EPS){
            return shadowCoef;
        }
        r = min(r, res.x * 16.0 / c);
        c += res.x;
    }
    return 1.0 - shadowCoef + r * shadowCoef;
}
vec2 raymarch(in vec3 ro, in vec3 rd){
	vec2 res = vec2(-1.0, -1.0);
	float d = FAR;
	float total = 0.0;
	float tplane = -ro.y / rd.y;
	if (tplane > 0.){
		res.x = tplane;
		res.y = -0.9;
	}
	vec3 p = vec3(0.0);
	for (int i = 0; i < 32; i ++){
		p = ro + rd * total;
		vec2 r = map(p);
		d = r.x;
		if (d < EPS){
			if (tplane > total){
				res.x = total;
				res.y = r.y;
			}
			break;
		}
		total += d;
	}
	return res;
}
vec3 render(vec3 ro, vec3 rd){
	vec3 col = vec3(.1, .2, .3);

	vec2 res = raymarch(ro,rd);
	float t = res.x;
	float m = res.y;
	if (m > -1.0){
		vec3 pos = ro + t * rd;
	        vec3 lig = (vec3(-1.0, 1.0, 1.0));
		vec3 nor = vec3(.0);
		if (m <= -0.9){
		        nor = vec3(0.0, 1.0, 0.0);
			col = vec3(0.4, 0.4, 0.4) * getPattern(pos.xz, 2, 0.5);
		} else {
		        nor = calcNormal(pos);
			col = vec3(0.0, 0.3, 0.5);
		}
		col *= dot(nor, lig);
		col *= calcShadow(pos + nor * EPS, lig);
	}
	
	return col;
}
vec3 draw06(vec2 uv){
	float t = time * 0.;
	vec3 ta = vec3(.0, -.0, -.0);
	vec3 ro = ta + vec3(.0, 1.0, 2.0);
	ro.xz *= rot2D(t);
	
	float cr = 0.0;
	
	vec3 cw = normalize(ta - ro);
	vec3 cp = vec3(sin(cr), cos(cr) ,0.0);
	vec3 cu = normalize( cross(cw,cp) );
	vec3 cv = normalize( cross(cu,cw) );
        mat3 cam = mat3( cu, cv, cw );

	vec3 rd = normalize(cam * vec3(uv, 1.0));

	vec3 col = render(ro, rd);
	
	return col;
}

void main( void ) {
	float t = time * 9.20;
	vec2 uv = (gl_FragCoord.xy * 2.0 - resolution.xy) / max(resolution.x, resolution.y);

	vec3 col = draw06(uv);

	gl_FragColor = vec4(vec3(col), 1.0 );

}