//
//
// you can have this shade in a windows exe as an so called "Scene Demo"
//
//
// skype: alien 5ive
//
//
//

#ifdef GL_ES
precision mediump float;
#endif
uniform float time;
uniform vec2 resolution;
#define iTime time
#define iResolution resolution
const vec4 iMouse = vec4(0.0);
#define SPEED .1
#define FOV 1.5

#define MAX_STEPS 100
#define SHADOW_STEPS 100
#define SHADOW_SOFTNESS 10.
#define EPS .0001
#define RENDER_DIST 5.
#define AO_SAMPLES 5.
#define AO_RANGE 10.
#define LIGHT_COLOR vec3(1.,.5,.3)

#define PI 3.14159265359
#define saturate(x) clamp(x, 0., 1.)

vec3 _ballPos = vec3(0);
float _ballSize = .5;
float hash(vec3 uv) {
    float f = fract(sin(dot(uv, vec3(.009123898, .00231233, .00532234))) * 111111.5452313);
    return f;
}
float noise(vec3 uv) {
    vec3 fuv = floor(uv);
    vec4 cell0 = vec4(
        hash(fuv + vec3(0, 0, 0)),
        hash(fuv + vec3(0, 1, 0)),
        hash(fuv + vec3(1, 0, 0)),
        hash(fuv + vec3(1, 1, 0))
    );
    vec2 axis0 = mix(cell0.xz, cell0.yw, fract(uv.y));
    float val0 = mix(axis0.x, axis0.y, fract(uv.x));
    vec4 cell1 = vec4(
        hash(fuv + vec3(0, 0, 1)),
        hash(fuv + vec3(0, 1, 1)),
        hash(fuv + vec3(1, 0, 1)),
        hash(fuv + vec3(1, 1, 1))
    );
    vec2 axis1 = mix(cell1.xz, cell1.yw, fract(uv.y));
    float val1 = mix(axis1.x, axis1.y, fract(uv.x));
    return mix(val0, val1, fract(uv.z));
}
float fbm(vec3 uv) {
    float f = 0.;
    float r = 1.;
    for (int i = 0; i < 3; ++i) {
        f += noise((uv + 10.) * r) / (r *= 2.);
    }
    return f / (1. - 1. / r);
}
void tRotate(inout vec2 p, float angel) {
    float s = sin(angel), c = cos(angel);
	p *= mat2(c, -s, s, c);
}
vec3 tRepeat3(inout vec3 p, vec3 r) {
    vec3 id = floor((p + r * .5) / r);
    p = mod(p + r * .5, r) - r * .5;
    return id;
}
float sdSphere(vec3 p, float r) {
	return length(p) - r;
}
float sdCross(vec3 p, vec3 r) {
    p =abs(p) - r;
    p.xy = p.x < p.y ? p.xy : p.yx;
    p.yz = p.y < p.z ? p.yz : p.zy;
    p.xy = p.x < p.y ? p.xy : p.yx;
    return length(min(p.yz, 0.)) - max(p.y, 0.);
}
float opU(float a, float b) {
    return min(a, b);
}
float opI(float a, float b) {
    return max(a, b);
}
float opSU(float a, float b, float k)
{
    float h = clamp(.5 + .5 * (b - a) / k, 0., 1.);
    return mix(b, a, h) - k * h * (1. - h);
}
float scene(vec3 p) {
    float size = 1.;
    float d = -2.;
    
    for (int i = 0; i < 5; ++i) {
        size *= 3.;
        vec3 q = p * size;
        tRepeat3(q, vec3(3));
    	d = opI(d, sdCross(q, vec3(.5)) / size);
    }
    d = opU(d, p.y + .169);
    return d;
}
float map(vec3 p) {
    return opSU(scene(p), sdSphere(p - _ballPos, _ballSize), .15);
}
float trace(vec3 ro, vec3 rd, float maxDist, out float steps) {
    float total = 0.;
    steps = 0.;
    
    for (int i = 0; i < MAX_STEPS; ++i) {
        ++steps;
        float d = map(ro + rd * total);
        total += d;
        if (d < EPS || maxDist < total) break;
    }
    
    return total;
}
float softShadow(vec3 ro, vec3 rd, float maxDist) {
    float total = 0.;
    float s = 1.;
    
    for (int i = 0; i < SHADOW_STEPS; ++i) {
        float d = scene(ro + rd * total);
        if (d < EPS) {
            s = 0.;
            break;
        }
        if (maxDist < total) break;
        s = min(s, SHADOW_SOFTNESS * d / total);
        total += d;
    }
    
    return s;
}
vec3 getNormal(vec3 p) {
    vec2 e = vec2(.0001, 0);
    return normalize(vec3(
        map(p + e.xyy) - map(p - e.xyy),
        map(p + e.yxy) - map(p - e.yxy),
        map(p + e.yyx) - map(p - e.yyx)
	));
}
float calculateAO(vec3 p, vec3 n) {
    
    float r = 0., w = 1., d;
    
    for (float i = 1.; i <= AO_SAMPLES; i++){
        d = i / AO_SAMPLES / AO_RANGE;
        r += w * (d - scene(p + n * d));
        w *= .5;
    }
    
    return 1.-saturate(r * AO_RANGE);
}
vec3 _texture(vec3 p) {
    vec3 t = fbm((p*50.)) * vec3(.9, .7, .5) * .75
        + smoothstep(.4, .9, fbm((p*10. + 2.))) * vec3(1., .4, .3)
        - smoothstep(.5, .9, fbm((p*100. + 4.))) * vec3(.4, .3, .2);
    return saturate(t);
}
vec3 glow(vec3 p) {
    return pow(smoothstep(_ballSize * 1.8,_ballSize, distance(p, _ballPos)), 5.) * LIGHT_COLOR * 3.;
}
float pausingWave(float x, float a, float b) {
    x = abs(fract(x) - .5) * 1. - .5 + a;      
    return smoothstep(0., a - b, x); 
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
	vec2 uv = fragCoord.xy / iResolution.xy * 2. - 1.;
    uv.x *= iResolution.x / iResolution.y;
	vec2 mouse = iMouse.xy / iResolution.xy * 2. - 1.;
    mouse.x *= iResolution.x / iResolution.y;
    mouse *= 2.;
    
    float time = iTime * SPEED + .5;
    float jump = time * 80.;
    _ballPos = vec3(0, -.15, time);
    _ballPos.xy+= (noise(_ballPos * 20.) - .5) * .1;
    vec3 ro =  vec3(0, abs(sin(jump)) * .01 - .07, .75 + _ballPos.z);
    vec3 rd = normalize(vec3(uv, FOV));
    vec3 light = _ballPos;
    
    if (iMouse.z > 0.) {
        mouse.y = max(mouse.y, -.5);
        tRotate(rd.yz, -mouse.y);
        tRotate(rd.xz, -mouse.x);
    } else {
        tRotate(rd.xy, sin(jump) * .002);
        tRotate(rd.yz, .2);
        tRotate(rd.xz, sin(jump) * .02);
        tRotate(rd.yz, -pausingWave(time * .25 - .005, .04, .01) * 1.5);
        float dir = sign(hash(vec3(0, 0, floor(time - .5))) - .5);
        tRotate(rd.xz, dir * pausingWave(time, .15, .1) * 2.5);
    }
    ro += noise(ro * 10000.) / 300.;
    float steps, dist = trace(ro, rd, RENDER_DIST, steps);
    vec3 p = ro + rd * dist;
    vec3 normal = getNormal(p);
    vec3 l = normalize(light - p);
    vec3 shadowStart = p + normal * EPS * 10.;
    float shadowDistance = distance(shadowStart,light) - _ballSize * .5;
    float shadow = softShadow(shadowStart, l, shadowDistance);
    float ambient = .25;
    float diffuse = max(0., dot(l, normal));
    float specular = pow(max(0., dot(reflect(-l, normal), -rd)), 8.);
    float ao = calculateAO(p, normal);
	fragColor.rgb = (ao * _texture(p)) * (ambient * (2. - LIGHT_COLOR) * .5 + (specular + diffuse) * shadow * LIGHT_COLOR) + glow(p);
    fragColor *= .3 + sqrt(steps / float(MAX_STEPS)) * .7;
    fragColor = mix(fragColor, vec4((1. - LIGHT_COLOR) * .02, 1.), saturate(dist * dist * .05));
    fragColor = pow(fragColor, vec4(1. / 2.2));
}
void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}