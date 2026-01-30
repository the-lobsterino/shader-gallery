#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

#define M_PI atan(1.0) * 4.0

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

vec2 nfract(vec2 co) {
	float x = co.x;
	float y = co.y;
	return vec2(x >= 0.0 ? x - floor(x) : x - ceil(x), y >= 0.0 ? y - floor(y) : y - ceil(y));
}

vec2 nfloor(vec2 co) {
	float x = co.x;
	float y = co.y;
	return vec2(x >= 0.0 ? floor(x) : ceil(x), y >= 0.0 ? floor(y) : ceil(y));
}

float sinc(float t) {
	return (sin(t) + 1.0) / 2.0;
}

float cosc(float t) {
	return (cos(t) + 1.0) / 2.0;
}


vec2 rndstep(vec2 p, int i) {
	vec2 seed = vec2(0.2342352, 0.4234254);
	float pwr = sinc(float(i));
	vec2 p1 = p * pwr; //vec2(pow(seed.x, pwr), pow(seed.y, pwr));
	return p1;
}

float DistToLine(vec2 pt1, vec2 pt2, vec2 testPt)
{
  vec2 lineDir = pt2 - pt1;
  vec2 perpDir = vec2(lineDir.y, -lineDir.x);
  vec2 dirToPt1 = pt1 - testPt;
  return abs(dot(normalize(perpDir), dirToPt1));
}

float drawLine(vec2 p1, vec2 p2, vec2 uv, float Thickness) {
  float a = abs(distance(p1, uv));
  float b = abs(distance(p2, uv));
  float c = abs(distance(p1, p2));

  if ( a >= c || b >=  c ) return 0.0;

  float p = (a + b + c) * 0.5;

  // median to (p1, p2) vector
  float h = 2.0 / c * sqrt( p * ( p - a) * ( p - b) * ( p - c));

  return mix(1.0, 0.0, smoothstep(0.5 * Thickness, 1.5 * Thickness, h));
}


void main2(vec2 uv)
{
	float t = time + 8.0;
	vec2 r = resolution;
	
	vec2 no = uv;
	vec2 o = vec2(0.0);
	vec2 aspect = vec2(1.0, r.y / r.x);
	float sz = 0.0;
	float t2 = t;
	vec2 idx = vec2(0.0);
	vec2 boxOffset = vec2(0.0);
	
	o = no * r - r / 2.0;
	t = t2;
	
	// bool cutCircle = length(boxOffset)
	vec2 or = o / r;
	
	if (sz > 6.0) {
		t = 8.0;
	}
		
	o = vec2(length(o) / r.y - .3, atan(o.y,o.x) + fract(-t / 100.0) * 2.0 * M_PI);
	
	vec2 o2 = o;
	
	float width = 20.0;
	float scale = 20.0;
	float offset = 0.02;
	
	o.x += 0.3;
	
	float y0to1 = (o.y + M_PI) / (2.0 * M_PI); // + floor(o2.x * scale);
	o.x = (fract(o.x * scale + y0to1) + 1.0 + y0to1) / width;
	o.x = (o.x - 0.05 * 1.5) / 0.2;
	o.x -= (o.y + M_PI) / (8.0 * M_PI);
	o.y *= M_PI / 2.0 + offset;
	o.y = sin(M_PI * o.y);
	
	float dir = mod(floor(o2.x * scale), 2.0) == 0.0 ? 1.0 : -1.0;
	dir *= floor(o2.x * scale / 2.0);
	vec4 s = 0.08 * cos(1.5*vec4(0,1,2,3) + dir * t + o.y + cos(o.y) * cos(8.0));
	// s = sz > 6.0 ? vec4(1.0) : s;
	vec4 e = s.yzwx;
	vec4 f = max(o.x-s,e-o.x);
	vec4 color = o.x > -0.1 ? dot(clamp(f*r.y,0.,1.), 80.*(s-e)) * (s-.1) + (e - o.x) : vec4(0.0);
	
	float cutoff = 0.15;
	gl_FragColor = o2.x + y0to1 / scale < cutoff ? color : vec4(1.0);
	
	vec2 ot = boxOffset;
	// gl_FragColor = vec4(ot.x, ot.y, 0.0, 1.0);
}



void main() {

	vec2 position = ( gl_FragCoord.xy / resolution.xy );

	vec2 o = vec2(0.0);
	
	vec2 no = position;
	float t = time + 8.0;
	vec2 aspect2 = vec2(1.0, resolution.y / resolution.x);
	float sz2 = 0.0;
	float t2 = t;
	vec2 idx = vec2(0.0);
	vec2 boxOffset = vec2(0.0);

	const int maxi2 = 6;
	for (int i = 0; i <= maxi2; i++) {
		float sc = pow(2.0, float(i));
		float sc2 = pow(2.0, float(maxi2 - i + 1));
		float j = float(i);
		float maxj = float(maxi2);
		
		bool gotOne = false;
		
		vec2 to2 = nfloor(no * sc);
		
		float tslow = t  / 100.0;
		
		vec2 to3 = to2;
		float rndMove = mix(rand(to3 + floor(tslow)), rand(to3 + floor(tslow) + 1.0), fract(tslow));
		float rnd = rand(to2);
		
		float tsc = .1 * t * j / sc + rnd * 1000.0;
		vec2 bo = 0.0 * (i > 0 ? vec2(cosc(tsc), sinc(tsc)) : vec2(0.0));
		
		vec2 to = nfract((no + bo) * sc);
		vec2 tbo = nfract(bo * sc);
		
		// big on top
		bool check1 = length((o - 0.5) * aspect2) < 0.15;
		// small on top
		bool check2 = length((to - 0.5) * aspect2) > 0.15;

		float prob = 0.0;
		if (i == 0) {
			prob = 1.0;
		} else if (i >= 3) {
			prob = 0.5 / j;
		}
		
		bool check = rnd < prob && sz2 > 1.0 && length(to - 0.5) < sinc(t * 2.5 + 1000.0 * rnd) ? check2 : check1;
		// check = check1;
		bool cutCircle = false;
		if (check) {
			cutCircle = length((tbo - 0.5) * aspect2) <= 0.51;
		}
						
		// bool visible = rand(to2 + vec2(0.254, 0.2342543)) < prob;
		bool visible = !cutCircle;
		// if (!visible) continue;
		
		o = check ? o : to;
		sz2 = check ? sz2 : float(i + 1);
		t2 = check ? t2 : t * (rnd + 0.5) + rnd * 1000.0;
		idx = check ? idx : to2;
		boxOffset = check ? boxOffset : to;
		gotOne = gotOne || check;

		if (gotOne) {
			// break;
		}
	}
	
	// vec2 orepeat = o * resolution - resolution / 2.0;
	vec2 orepeat = o;
	//float gsc = 0.5;
	o = (no - 0.5) * 1.5 + 0.5;
	
	vec2 aspect = vec2(resolution.x / resolution.y, 1.0);
	
	vec2 p = vec2(0.189346713, 0.1982346);
	
	vec2 oc = vec2(length(o - 0.5), atan(o.y - 0.5, o.x - 0.5));
	
	float scale = 50.0;
	
	float r = 0.0;
	float g = 0.0;
	float b = 0.0;
	
	const int pts = 2;
	float v1 = rand(floor(rndstep(p, 0) * scale));
	float v2 = rand(floor(rndstep(p, 1) * scale));
	float v3 = rand(floor(rndstep(p, 2) * scale));
	float v4 = rand(floor(rndstep(p, 3) * scale));
	const int maxi = 20;
	
	for (int i = 1; i <= maxi; i++) {
		//int j = int(mod(float(i), float(maxi)));
		float v5 = rand(floor(rndstep(p, i * pts + 2) * scale));
		float v6 = rand(floor(rndstep(p, i * pts + 3) * scale));
		if (i == maxi - 1) {
			v5 = rand(floor(rndstep(p, 0) * scale));
			v6 = rand(floor(rndstep(p, 1) * scale));
		}
		if (i == maxi) {
			v5 = rand(floor(rndstep(p, 2) * scale));
			v6 = rand(floor(rndstep(p, 3) * scale));
		}
		
		
		vec2 v12 = vec2(v1, v2);
		vec2 v34 = vec2(v3, v4);
		vec2 v56 = vec2(v5, v6);
		
		// v34 += 0.1 * (v56 - v12);
		b += drawLine(v12, v34, o, 0.003);
		float ti = time / 2.0;
		float tflen = 0.1;
		float tf = fract(ti);
		int t = int(mod(ti, float(maxi)));
		
		vec2 v = (v34 - v12);
		vec2 w = (v56 - v34);
		
		tflen /= length(v);
		vec2 endpoint = v12 + min(1.0, tf + tflen) * v;
		r += drawLine(v12 + tf * v, endpoint, o, 0.006);
		
		float d1 = length(v12 + tf * v - o);
		float d2 = 0.0;
		vec2 p1 = v12 + tf * v;
		vec2 p2 = vec2(0.0);
		float sz = 0.05;

		bool allInOne = tf + tflen < 1.0;
		
		if (allInOne) {
			d2 = length(endpoint - o);
			p2 = endpoint;
			
			d2 = length(endpoint - o);
			p2 = endpoint;
		}
		
		float tf2len = tflen - (min(1.0, tf + tflen) - tf);
		tf2len *= length(v) / length(w);
		if (i <= maxi) {
			r += drawLine(v34, v34 + tf2len * w, o, 0.006);
			
			if (!allInOne) {
				d2 = length(v34 + tf2len * w - o);
				p2 = v34 + tf2len * w;
			}
		}
		
		vec2 mid1 = mix(v12, v34, tf + 0.5);
		vec2 mid2 = mix(v34, v56, tf - 0.5);
		vec2 mid = mix(mid1, mid2, tf);
		
		for (int j = 0; j < 4; j++) {
		
			float th = sin(time / 1.0 + float(j));
			vec2 mid = (mid - 0.5) * mat2(cos(th), -sin(th), sin(th), cos(th)) + 0.5;
			
			float d = length((mid - o) * aspect);
			if (i <= maxi) {
				g += d < sz ? d / sz : 0.0;
				if (d < sz) {
					float sc = sz * 2.8;
					vec2 uv = (mid - o) / sc + 0.5;
					
						// vec2 offset = 0.0 * vec2(float(j));
					main2(uv);
				}
			}
		}
		// g += d1 < sz ? d1 / sz : 0.0;
		// g += d2 < sz ? d2 / sz : 0.0;
				
		v1 = v3;
		v2 = v4;
		v3 = v5;
		v4 = v6;
	}
	
	if (g == 0.0) {
		main2(orepeat);
	}
	
	// g = g > 0.0 ? 1.0 - g: 0.0;
	/*if (g > 0.0) {
		main2(o);
	}*/
	
	// gl_FragColor += vec4(1.0 * r, 0.0, b, 1.0);
	// gl_FragColor = vec4(o.x, 0.0, o.y, 1.0);
}