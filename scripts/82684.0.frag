precision highp float;

uniform vec2 resolution;

const float FOV = 1.0;
const int MAX_STEPS = 256;
const float MAX_DIST = 500.;
const float EPSILON = 0.001;

vec2 fmin(vec2 res1, vec2 res2) {
    return (res1.x < res2.x) ? res1 : res2;
}

float pln(vec3 p, float pos){
        return p.z + pos;
}

float sph(vec3 p, float r)
{
	return length(p) - r;
}

vec2 map(vec3 p)
{
	// pln
	float plnDist = pln(p, 2.);
	float plnID = 2.0;
	vec2 plane = vec2(plnDist, plnID);
	// sph
	float sphDist = sph(p, 1.);
	float sphID = 1.;
	vec2 sphere = vec2(sphDist, sphID);
	// res
	vec2 res = fmin(sphere, plane);
	return res;
}

vec2 rayMarch(vec3 ro, vec3 rd) {
	vec2 hit, object;
	for (int i = 0; i < MAX_STEPS; i++)
	{
		vec3 p = ro + object.x * rd;
		hit = map(p);
		object.x += hit.x;
		object.y = hit.y;
		if (abs(hit.x) < EPSILON || object.x > MAX_DIST)
		break;
	}
	return object;
}

vec3 getNormal(vec3 p) {
    vec2 e = vec2(EPSILON, 0.0);
    vec3 n = vec3(map(p).x) - vec3(map(p - e.xyy).x, map(p - e.yxy).x, map(p - e.yyx).x);
    return normalize(n);
}

vec3 getLight(vec3 p, vec3 rd, vec3 col)
{
	vec3 lightPos = vec3(-10, 10, 10);
        vec3 L = normalize(lightPos - p);
        vec3 N = getNormal(p);
	vec3 diffuse = col * clamp(dot(L, N), 0.0, 1.0);
	return diffuse;
}

vec3 getMaterial(float id) {
    vec3 m;
    if(id == 1.0)
        m = vec3(0.5, 0.5, 0.0);
    if(id == 2.0)
        m = vec3(0.0, 0.5, 0.5);
    return m;
}

void render(inout vec3 col, in vec2 uv)
{
    vec3 ro = vec3(-3, 0, 0);
    vec3 rd = normalize(vec3(FOV, uv));

    vec2 object = rayMarch(ro, rd);

    if (object.x < MAX_DIST){
    vec3 material= getMaterial(object.y);
    vec3 p = ro + object.x * rd;
    col += getLight(p, rd, material);
    }
}

void main(void) {
	vec2 uv = (2.0 * gl_FragCoord.xy - resolution) / resolution.y;

	vec3 col;
	render(col, uv);
	col = pow(col, vec3(0.4545));
	gl_FragColor = vec4(col, 1.0);
}
