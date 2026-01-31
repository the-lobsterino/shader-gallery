#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define PI 3.14159265
#define TAU (2.0*PI)

// Rotate around a coordinate axis (i.e. in a plane perpendicular to that axis) by angle <a>.
// Read like this: R(p.xz, a) rotates "x towards z".
// This is fast if <a> is a compile-time constant and slower (but still practical) if not.
void pR(inout vec2 p, float a) {
    p = cos(a) * p + sin(a) * vec2(p.y, -p.x);
}

////////////////////////////////////////////////////////////////

const float FOV = 1.2;
const int MAX_STEPS = 1024;
const float MAX_DIST = 600.0;
const float EPSILON = 0.001;

vec2 fOpUnionID(vec2 res1, vec2 res2) {
    return (res1.x < res2.x) ? res1 : res2;
}

vec2 fOpDifferenceID(vec2 res1, vec2 res2) {
    return (res1.x > -res2.x) ? res1 : vec2(-res2.x, res2.y);
}

////////////////////////////////////////////////////////////////

float sdSphere( vec3 p, float s )
{
  return length(p)-s;
}

float sdBox( vec3 p, vec3 b )
{
  vec3 q = abs(p) - b;
  return length(max(q,0.0)) + min(max(q.x,max(q.y,q.z)),0.0);
}

////////////////////////////////////////////////////////////////

vec2 map(vec3 p) {
	vec2 res = vec2(sdBox(p, vec3(MAX_DIST,1,MAX_DIST)), 2); //chão
	res = fOpUnionID(res, vec2(sdSphere(p-4.0, 4.0), 1)); //esfera
    return res;
}

vec2 rayMarch(vec3 ro, vec3 rd) {
    vec2 hit, object;
    for(int i = 0; i < MAX_STEPS; i++) {
        vec3 p = ro + object.x * rd;
        hit = map(p);
        object.x += hit.x;
        object.y = hit.y;
        if(abs(hit.x) < EPSILON || object.x > MAX_DIST)
            break;
    }
    return object;
}

vec3 getNormal(vec3 p) {
    vec2 e = vec2(EPSILON, 0.0);
    vec3 n = vec3(map(p).x) - vec3(map(p - e.xyy).x, map(p - e.yxy).x, map(p - e.yyx).x);
    return normalize(n);
}

vec3 getLight(vec3 p, vec3 rd, vec3 color) {
    vec3 lightPos = vec3(10.0, 55.0, -20.0);
    vec3 L = normalize(lightPos - p);
    vec3 N = getNormal(p);
    vec3 V = -rd;
    vec3 R = reflect(-L, N);

    vec3 specColor = vec3(0.5);
    vec3 specular = specColor * pow(clamp(dot(R, V), 0.0, 1.0), 10.0);
    vec3 diffuse = color * clamp(dot(L, N), 0.0, 1.0);
    vec3 ambient = color * 0.05;
    vec3 fresnel = 0.25 * color * pow(1.0 + dot(rd, N), 3.0);

    // shadows
    float d = rayMarch(p + N * 0.02, normalize(lightPos)).x;
    if(d < length(lightPos - p))
        return ambient + fresnel;

    return diffuse + ambient + specular + fresnel;
}

vec3 getMaterial(vec3 p, float id) {
	if (id == 1.0)
	    return vec3(0.9, 0.0, 0.0);
	    
	if (id ==  2.0)
	    return vec3(0.2 + 0.4 * mod(floor(p.x) + floor(p.z), 2.0));
	    
	if (id ==  3.0)
	    return vec3(0.7, 0.8, 0.9);
	
	if (id == 4.0) {
	    vec2 i = step(fract(0.5 * p.xz), vec2(1.0 / 10.0));
	    return ((1.0 - i.x) * (1.0 - i.y)) * vec3(0.37, 0.12, 0.0);
	}
}

mat3 getCam(vec3 ro, vec3 lookAt) {
    vec3 camF = normalize(vec3(lookAt - ro));
    vec3 camR = normalize(cross(vec3(0, 1, 0), camF));
    vec3 camU = cross(camF, camR);
    return mat3(camR, camU, camF);
}

void mouseControl(inout vec3 ro) {
    vec2 m = mouse;
    pR(ro.yz, m.y * PI * 0.4 - 0.5);
    pR(ro.xz, m.x * TAU);
}

void render(inout vec3 col, in vec2 uv) {
    vec3 ro = vec3(36.0, 19.0, -36.0);
    mouseControl(ro);

    vec3 lookAt = vec3(0, 10, 0);
    vec3 rd = getCam(ro, lookAt) * normalize(vec3(uv, FOV));

    vec2 object = rayMarch(ro, rd);

    vec3 background = vec3(0.5, 0.8, 0.9);
    if(object.x < MAX_DIST) {
        vec3 p = ro + object.x * rd;
        vec3 material = getMaterial(p, object.y);
        col += getLight(p, rd, material);
        // fog
        col = mix(col, background, 1.0 - exp(-0.00001 * object.x * object.x));
    } else {
        col += background - max(0.9 * rd.y, 0.0);
    }
}

void main() {
    vec2 uv = (2.0 * gl_FragCoord.xy - resolution.xy) / resolution.y;

    vec3 col;
    render(col, uv);

    // gamma correction
    col = pow(col, vec3(0.4545));
    gl_FragColor = vec4(col, 1.0);
}