#extension GL_OES_standard_derivatives : enable

precision mediump float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define iTime time

#define trace_itarations 64
#define trace_coef .9
#define l_thr 4.

#define contact .01

float map (vec3 p) {
	vec3 a = abs(p);
    float d = -max(a.x - 2.0, a.y - 1.0);
    float az = (fract(p.z / 2.0) - 0.5) * 2.0;
    d = min(d, max(abs(p.x - 1.0), abs(az - 0.25)) - 0.25);
    d = min(d, max(abs(p.x + 1.0), abs(az + 0.25)) - 0.25);
    float bz = (fract((p.z + 1.0) / 2.0) - 0.5) * 2.0;
    d = min(d, max(abs(abs(p.y) - 1.0), abs(bz)) - 0.05);
    float bz1 = (fract((p.z + 1.0) / 2.0) - 0.3) * 2.0;
    d = min(d, max(abs(abs(p.y) - 1.0), abs(bz1)) - 0.15);
    return d;
}

float lightmap (vec3 p, float r, vec3 loc) {
	vec3 xyz = p;
	xyz -= loc;
	return length(xyz) - r;
}

vec3 normal(vec3 p)
{
	vec3 o = vec3(0.0001, 0.0, 0.0);
    return normalize(vec3(map(p+o.xyy) - map(p-o.xyy),
                          map(p+o.yxy) - map(p-o.yxy),
                          map(p+o.yyx) - map(p-o.yyx)));
}

float shadow_trace(vec3 o, vec3 r, vec3 loc, out float cl_coef) {
	float t = .0;
	float lm = 0.;
	float min_lm = 100.;
	cl_coef = l_thr + 1.;
	for (int i = 0; i < trace_itarations; ++i){
		lm = lightmap(o + r * t, .1, loc);
		if (lm < min_lm) min_lm = lm;
		t += lm * trace_coef;
		//if (t > 5.0) break;
	}
	if (lm <= l_thr) cl_coef = lm;
	return t;
}

float trace(vec3 o, vec3 r) {
	float t = .0;
	for (int i = 0; i < trace_itarations; ++i){
		t += map(o + r * t) * trace_coef;
		//if (t > 5.0) break;
	}
	return t;
}


void main( void ) {

	vec2 uv = ( gl_FragCoord.xy / resolution );
	uv = uv * 2. - 1.;
	uv.x *= resolution.x / resolution.y;
	
	vec3 r = normalize(vec3(uv, 1.0 - dot(uv, uv) * .2));
	vec3 o = vec3(.0, -.1, 1. + iTime);
	
	vec3 lightcol = vec3(sin(iTime * .5 + .5), cos(iTime) * .5 + .5, sin(iTime) * .5 + .5);

	vec3 lightLocation = vec3(cos(iTime) * .2, sin(iTime) * .2, o.z + 2.);
	
	float glow = .0;
	
	float t = trace(o, r);
	vec3 w = o + r * t;
	vec3 n = normal(w);
	vec3 l = normalize(w - lightLocation);
	float lig = -dot(n, l) ;
	vec3 col = vec3(0.);
	if (map(o + r * t) <= contact) {
		vec3 d = normalize(lightLocation - (o + r * t));
		float t1 = trace(o + r * t, d);
		float s = shadow_trace (o + r * t, d, lightLocation, glow);
		if (t1 - s > 0.) {
			if (glow <= l_thr) {
				col = mix(lig * lightcol, lightcol, glow / l_thr);
			} else
				col = lig * lightcol;
		} else {
			col = vec3(0.);
		}
	} else 
		col = lig * lightcol;
	
	float y = shadow_trace (o, r, lightLocation, glow);
	
	if (t > y) {
		col = vec3(lightcol);
	}

	gl_FragColor = vec4(col, 1.);

}