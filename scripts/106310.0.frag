#ifdef GL_ES
precision highp float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define iTime (time)


#define MIN_DIST (0.001)
#define MAX_DIST (10.)
#define MAX_STEPS (200)
#define MOVE (vec3(-curve(iTime * 0.15)*0.9, 0., iTime * 0.15))
#define SUN_POS (vec3(0., 2., 3.5) + MOVE)
#define SKY_COLOR (vec3(1.0) * 1.2)

float noise(vec2 n) {
	return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
}

float smoothNoise(vec2 n) {
    vec2 id = floor(n);
    vec2 shift = fract(n);
    vec2 d = vec2(1., 0.);
    shift = shift * shift * (3. - 2. * shift);
    float tl = noise(id);
    float tr = noise(id + d);
    float bl = noise(id + d.yx);
    float br = noise(id + d.xx);
    float tm = mix(tl, tr, shift.x * shift.x);
    float bm = mix(bl, br, shift.x * shift.x);
    float mx = mix(tm, bm, shift.y * shift.y);
    return mx;
}

vec3 toPolar(vec3 p) {
    float dist = length(p);
    return vec3(
        dist, 
        acos(p.z / dist),
        atan(p.y / p.x));
}

// ======

struct Material {
    vec3 diffuse;
};

// ======

float curve(float z) {
    float d = sin(z * 0.3) * 0.55 + cos(z * 1.5) * 0.05;
    //float d = smoothNoise(vec2(0., z)) * 0.8;
    return d * d;
}

float sdTerrain(vec3 p) {
    float disp = smoothNoise(p.xz);
    disp *= min(pow(sqrt(abs(p.x + curve(p.z))), 2.5), 1.);
    return (p.y - disp * 1.) * 0.9;
}

float sdWater(vec3 p) {
    float disp = smoothNoise(p.xz * 20. + vec2(iTime * 0.5)) * 0.005;
    disp += smoothNoise(p.xz * 50. + vec2(iTime * 2.)) * 0.002;
    return (p.y - 0.07 - disp);
}

vec2 getSceneDist(vec3 p) {
    float d;
    vec2 closest = vec2(MAX_DIST, -1.);
    
    float dTerrain = sdTerrain(p);
    d = dTerrain;
    if (d < closest.x) { closest = vec2(d, 2.); }
    
    float dWater = sdWater(p);
    d = dWater;
    if (d < closest.x) { closest = vec2(d, 1.); }
    
    if (abs(dWater - dTerrain) < 0.01) { closest.y = 3.; }
    
    return closest;
}

// =======

vec3 getNormal(vec3 p) {
    float dist = getSceneDist(p).x;
    vec2 e = vec2(0.01, 0.);
    vec3 n = dist - vec3(
        getSceneDist(p - e.xyy).x,
        getSceneDist(p - e.yxy).x,
        getSceneDist(p - e.yyx).x);
    return normalize(n);
}

vec2 rayMarch(vec3 o, vec3 d, float md) {
    float totalDist = 0.;
    
    for (int i = 0; i < MAX_STEPS; ++i) {
        vec2 hit = getSceneDist(o + d * totalDist);
        float dist = hit.x;
        float matId = hit.y;
        if ((dist) < md) return vec2(totalDist + dist, matId);
        totalDist += dist;
        if (totalDist > MAX_DIST) return vec2(totalDist, -1.); 
    }
    
    return vec2(MAX_DIST + 1., -1.);
}

vec3 matToColor(float matId, vec3 p, vec3 rd) {
    int id = int(matId);
    
    if (id == 1) {
        return vec3(0.5, 0.71, 0.54) * 0.8;
    }
    
    
    if (id == 2) {
        if (p.y > 0.6 + sin(p.z* 8.) * 0.03 + smoothNoise(p.xz * 10. + 100.) * 0.05) {
            return vec3(0.94, 0.86, 0.68);
        }
        
        if (p.y > 0.15 + sin(p.z* 8.) * 0.03 + smoothNoise(p.xz * 10.) * 0.05) {
            float f = smoothNoise(p.xz* 100.) * 0.1 + 0.9;
            return vec3(0.53, 0.3, 0.14) * f;
        }
        
        return vec3(0.48, 0.65, 0.20);
    }
    
    if (id == 3) return vec3(0.82, 0.92, 0.67);
    
    float skyDir = 1.-pow(dot(rd, vec3(0., 0., 1.)), 5.);
    
    return mix(vec3(0.9, 0.88, 0.72), vec3(0.67, 0.82, 0.74), skyDir);
}

void main()
{
    vec2 vpShift = vec2(resolution.x/resolution.y, 1.);
    vec2 vp = gl_FragCoord.xy/resolution.y*2. - vpShift;
    
    vec3 origin = vec3(0., 0.15, 2.) + MOVE;
    vec3 target = vec3(0., 0.1, 10.) + MOVE;
    vec3 up = vec3(0., 1., 0.);
     
    vec3 camPos = origin;
    vec3 camTarget = target;
    vec3 camForward = normalize(camTarget - camPos);
    vec3 camRight = normalize(cross(up, camForward));
    vec3 camUp = cross(camForward, camRight);
    
    vec3 ro = camPos;
    vec3 rd = normalize(1.5 * camForward + camRight * vp.x + camUp * vp.y);

    vec2 hit = rayMarch(ro, rd, MIN_DIST);
    vec3 touch = ro + rd * hit.x;
    vec3 col = matToColor(hit.y, touch, rd);
    vec3 norm = hit.x < MAX_DIST ? getNormal(touch) : vec3(0.);
    
    if (hit.x < MAX_DIST) {
        vec3 toSun = normalize(SUN_POS - touch);
        float fDiff = abs(dot(toSun, norm));
        fDiff = floor(fDiff * 20.) / 20.;
        col *= max(vec3(0.8), fDiff * SKY_COLOR);

        vec2 sec = rayMarch(touch + toSun * 0.01, toSun, MIN_DIST);
        if (sec.x < MAX_DIST) { col *= 0.6; }
    }
    
    if (int(hit.y) == 1) {
        vec3 reflD = reflect(rd, norm);
        vec3 reflO = touch + reflD * 0.02;
        vec2 reflHit = rayMarch(reflO, reflD, 0.001);
        vec3 reflCol = matToColor(reflHit.y, reflO + reflD * reflHit.x, reflD);
        col += reflCol * 0.3;
    }
    
    float fog = clamp(hit.x / 10., 0., 1.);
    fog *= pow(1. - rd.y * 2., 2.);
    fog = clamp(fog, 0., 1.);
    col += fog * 0.4 * vec3(0.9, 0.88, 0.72);
    
    float clouds = smoothNoise(vp * 4.);
    clouds += smoothNoise(vp * 8.) * 0.5;
    clouds += smoothNoise(vp * 16.) * 0.25;
    clouds += smoothNoise(vp * 32.) * 0.128;
    clouds /= 1.878;
    clouds *= clamp(vp.y, 0., 1.);
    if (hit.y < 0.) { col += clouds * 0.2; }
    
    gl_FragColor = vec4(col, 1.0);
}