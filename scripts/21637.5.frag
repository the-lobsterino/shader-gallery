// License Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.
// by @joat_es (http://joat.es) Dec.2014

// FXAA by Dave Hoskins (https://www.shadertoy.com/view/4dfGDj)

// >>> IMPORTANT NOTE: set the quality(*) [0.5, 1, 2, 4, 8] to '1' <<< \\
//     ===========================================================     \\
//     (*) located next to the 'hide code' button                      \\

#ifdef GL_ES
precision highp float;
#endif

uniform float time;
uniform vec2  mouse;
uniform vec2  resolution;

const vec3  light = vec3(0.5773);
const float FXAA_SPAN_MAX = 8.0;
const float FXAA_REDUCE_MUL = 1.0/8.0;
const float FXAA_REDUCE_MIN = (1.0/128.0);

float hash(float n) { return fract(sin(n)*43758.5453123); }
float map (vec3  p) { return length(p)-0.75; }

vec3 calcNormal(in vec3 p) {
	vec2 e = vec2(0.0001, 0.0);
	return normalize( vec3( map(p + e.xyy) - map(p - e.xyy),
				map(p + e.yxy) - map(p - e.yxy),
				map(p + e.yyx) - map(p - e.yyx) ));
}

vec3 hsv(in float h) {
	if (h > .45 && h < .55) return vec3(1.0);
	return sqrt( clamp(( abs( fract(h + vec3(3, 2, 1) / 3.0) * 6.0 - 3.0) - 1.0), 0.0 , 1.0));
}

vec3 corona(in vec2 pos, in vec3 rd) {
	vec3  m  = vec3(0.0);
	float lc = 1.8;			// corona width

	float dSq = lc * dot(pos, pos);
	if (dSq > 0.5) {
		float d = sqrt(dSq);
		m  = mix( vec3(1.0), vec3(0.1, 0.33, 1.0), smoothstep(0.4, 1.0, d));
		m += mix( m, vec3(0.0, 0.02, 0.2), smoothstep(0.8, 1.2, d));
		m *= dot(rd, light) * 0.5 + 1.0;
		m *= smoothstep(1.0, 0.9, sqrt(d));
	}
	return vec3( clamp(m, 0.0, 1.0));
}

vec3 surface(in vec3 pos, in vec3 rd) {
	vec3 nor, col;
	nor  = calcNormal(pos);
	col  = vec3(0.3, 0.6, 0.9) * clamp( dot(nor, light), 0.0, 1.0);
	col += vec3(0.2, 0.3, 0.4) * clamp(nor.y, 0.0, 1.0);
	col += vec3(0.1, 0.1, 0.9) * clamp(1.0 + dot(rd, nor), 0.0, 1.0);
	col += 0.05;
	// restrict the color palette
	float r = ceil(col.r*255. /  8.) *  8. / 256.;
	float g = ceil(col.g*255. /  8.) *  8. / 256.;
	float b = ceil(col.b*255. /  8.) *  8. / 256.;
	return col*vec3(r, b, g);
}

vec3 moon(in vec2 uv) {
	vec3 col = vec3(0.0);
	vec3 ro  = vec3(0.0, 0.0,  2.0);
	vec3 ta  = vec3(0.0, 0.0, -1.0);

	// camera
	vec3 cw = normalize(ta-ro);
	vec3 cp = vec3(0.0, 1.0, 0.0);
	vec3 cu = normalize( cross(cw, cp));
	vec3 cv = normalize( cross(cu, cw));
	vec3 rd = normalize(uv.x*cu + uv.y*cv + 1.5*cw);

	// ray march
	float tmax = 240.0;
	float h = 1.0;
	float t = 0.0;
	for (int i=0; i<120; i++) {
		if (h < 0.002 || t > tmax) break;
		h = map(ro + t*rd);
		t += h;
	}

	if (t > tmax)
		col = corona(uv, rd);
	else {
		vec3 pos = ro + t*rd;
		col = surface(pos, rd);
	}
	return pow(col, vec3(0.69));
}

vec3 calcFXAA(in vec2 pos) {
	vec2 add = vec2(1.0) / resolution;
			
	vec3 rgbNW = moon(pos+vec2(-add.x, -add.y));
	vec3 rgbNE = moon(pos+vec2( add.x, -add.y));
	vec3 rgbSW = moon(pos+vec2(-add.x,  add.y));
	vec3 rgbSE = moon(pos+vec2( add.x,  add.y));
	vec3 rgbM  = moon(pos);
	
	vec3 luma = vec3(0.299, 0.587, 0.114);
	float lumaNW = dot(rgbNW, luma);
	float lumaNE = dot(rgbNE, luma);
	float lumaSW = dot(rgbSW, luma);
	float lumaSE = dot(rgbSE, luma);
	float lumaM  = dot(rgbM,  luma);
	
	float lumaMin = min(lumaM, min( min(lumaNW, lumaNE), min(lumaSW, lumaSE)));
	float lumaMax = max(lumaM, max( max(lumaNW, lumaNE), max(lumaSW, lumaSE)));
	
	vec2 dir;
	dir.x = -((lumaNW + lumaNE) - (lumaSW + lumaSE));
	dir.y =  ((lumaNW + lumaSW) - (lumaNE + lumaSE));

	float dirReduce = max(
		(lumaNW + lumaNE + lumaSW + lumaSE) * (0.25 * FXAA_REDUCE_MUL), FXAA_REDUCE_MIN);

	float rcpDirMin = 1.0 / (min( abs(dir.x), abs(dir.y)) + dirReduce);

	dir  =	min( vec2( FXAA_SPAN_MAX,  FXAA_SPAN_MAX),
		max( vec2(-FXAA_SPAN_MAX, -FXAA_SPAN_MAX),
			   dir * rcpDirMin)) * add;

	vec3 rgbA = 0.5 * (moon( pos + dir * (0.33333 - 0.5)) +
			   moon( pos + dir *  0.5));

	vec3 rgbB = rgbA * (1.0/2.0) + (1.0/4.0) *
			(moon( pos.xy + dir * -0.5) +
			 moon( pos.xy + dir *  0.5));

	float lumaB = dot(rgbB, luma);
	if (lumaB < lumaMin || lumaB > lumaMax) return rgbA;
	else return rgbB;
}

void main(void) {
	vec2 uv = -1.0 + 2.0 * (gl_FragCoord.xy / resolution.xy);
	uv.x *= resolution.x / resolution.y;
	gl_FragColor = vec4( calcFXAA(uv), 1.0);
}