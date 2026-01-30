// Good list of distance functions here: http://www.iquilezles.org/www/articles/distfunctions/distfunctions.htm
// Shader by @xprogram

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const int RAY_STEPS = 32;
const float APPROX = 0.001;
const float MAX_DISTANCE = 50.0;
const float PI = radians(180.0);

vec3 edRep(const in vec3 p, const in vec3 c){
	return mod(p, c) - (c * 0.5);
}

float chSphere(const in vec3 p, const in float r){
	return length(p) - r;
}

float chBox(const in vec3 p, const in vec3 b){
	vec3 d = abs(p) - b;
	return min(max(d.x, max(d.y, d.z)), 0.0) + length(max(d, 0.0));
}

float chPlane(const in vec3 p, const in vec4 n){
	return dot(p, n.xyz) + n.w;
}

float chTorus(const in vec3 p, const in vec2 t){
	vec2 q = vec2(length(p.xz) - t.x, p.y);
	return length(q) - t.y;
}

vec2 opUn(const in vec2 a, const in vec2 b){
	return a.x < b.x ? a : b;
}

vec2 opSub(const in vec2 a, const in vec2 b){
	return -a.x > b.x ? a : b;
}

vec2 opIn(const in vec2 a, const in vec2 b){
	return a.x > b.x ? a : b;
}

vec2 map(const in vec3 p){
	vec3 g = edRep(p, vec3(5.0));

	return opIn(vec2(chSphere(g, 1.2), 5.67), vec2(chTorus(g, vec2(1)), 28.5));
}

vec2 raymarch(const in vec3 origin, const in vec3 dir, out vec3 hitp){
	float td = 0.0;
	vec2 da = vec2(0);
	vec3 rp = origin;
	hitp = rp;

	for(int i = 0; i < RAY_STEPS; i++){
		da = map(rp);
		td += da.x;

		if(da.x < APPROX){
			hitp = rp;
			return da;
		}

		if(td > MAX_DISTANCE){
			return vec2(0);
		}

		rp += dir * da.x;
	}

	return vec2(0);
}

// From: https://www.shadertoy.com/view/Xds3zN
vec3 setupDir(const in vec3 ro, const in vec3 ta, const in vec2 uv, const in float cr, const in float zoom){
	vec3 cw = normalize(ta - ro);
	vec3 cp = vec3(sin(cr), cos(cr), 0.0);
	vec3 cu = normalize(cross(cw, cp));
	vec3 cv = normalize(cross(cu, cw));

	return mat3(cu, cv, cw) * normalize(vec3(uv.xy, zoom));
}

vec3 snorm(const in vec3 p){
	vec2 h = vec2(APPROX, 0);

	return normalize(vec3(map(p + h.xyy).x, map(p + h.yxy).x, map(p + h.yyx).x) - map(p).x);
}

void shapeColor(out vec3 col, const in float c){
	col = 0.45 + 0.3 * sin(vec3(0.3, 0.2, 0.4) * (c - 2.0));
}

void boardColor(out vec3 col, const in float c, const in vec3 bos, const in vec3 hitp){
	shapeColor(col, c);
	col *= col + mod(floor(bos.x * hitp.z) + floor(bos.y * hitp.x) + floor(bos.y * hitp.y), 2.0);
}

void applyShade(out vec3 col, const in vec3 sp, const in vec3 ld){
	col *= vec3((dot(sp, ld)));
}

void main(){
	float aspect = resolution.x / resolution.y;

	vec3 hitPoint = vec3(0);
	vec3 pixelColor = vec3(0);

	vec2 uv = (gl_FragCoord.xy / resolution.xy) * 2.0 - 1.0;
	uv.x *= aspect;

	vec2 cursor = mouse.xy * 2.0 - 1.0;

	// Control parameters
	float mx = cursor.x * PI;
	float rsp = 5.0;

	vec3 camTarget = vec3(0, 0, 0);
	vec3 camPos = vec3(cos(cursor.y) * cos(mx) * rsp, sin(cursor.y) * rsp, cos(cursor.y) * sin(mx) * rsp) + camTarget;

	vec3 rayDir = setupDir(camPos, camTarget, uv, 0.0, 1.0);
	vec2 inf = raymarch(camPos, rayDir, hitPoint);
	vec3 lightDir = normalize(vec3(cos(time), 1, sin(time)));

	if(inf.x > 0.0){
		vec3 surfNorm = snorm(hitPoint);

		boardColor(pixelColor, inf.y, vec3(4), hitPoint);
		applyShade(pixelColor, surfNorm, lightDir);
	}

	gl_FragColor = vec4(pixelColor, 1.0);
}