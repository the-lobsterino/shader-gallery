/*
 * Original shader from: https://www.shadertoy.com/view/Wtf3Df
 */

#ifdef GL_ES
precision mediump float;
#endif

// glslsandbox uniforms
uniform float time;
uniform vec2 resolution;

// shadertoy emulation
#define iTime time
#define iResolution resolution

// --------[ Original ShaderToy begins here ]---------- //
#define ZOOM 1.5
#define MAX_STEPS 100
#define MIN_DISTANCE 0.0001
#define MAX_DISTANCE 50.
const vec3 _lightPos = vec3(-2., 5., -1.);
const vec3 _lightPos2 = vec3(2., 5., 1.);
const vec3 _lightDir = vec3(0., -.5, 1.);
const vec3 _lightColor = vec3(.92, 0.85, 0.99);
const float _pointIntense = .3;
const float _parallelIntense = 0.4;
const float _shadowMin = .01;
const float _shadowMax = 50.;
const float _shadowIntense = 1.;
const float _sphereSmooth = .15;
const float _k = 15.;

vec3 getRay(in vec3 ro, in vec3 lookAt, in vec2 uv) {
    vec3 f = normalize(lookAt - ro);
    vec3 r = cross(vec3(0., 1., 0.), f);
    vec3 u = cross(f, r);
    return normalize(uv.x * r + uv.y * u + f * ZOOM);
}

float sdPlane(in vec3 p) {
    return p.y;
}

float sdSphere(in vec3 p, in vec3 c, in float r) {
    return length(c - p) - r;
}

float sdBox( vec3 p, vec3 b )
{
  vec3 d = abs(p) - b;
  return length(max(d,0.0))
         + min(max(d.x,max(d.y,d.z)),0.0);
}

float opSU ( float d1, float d2, float k ) {
  float h = clamp( 0.5 + 0.5*(d2-d1)/k, 0.0, 1.0 );
  return mix( d2, d1, h ) - k*h*(1.0-h); 
}

float opSS( float d1, float d2, float k ) {
    float h = clamp( 0.5 - 0.5*(d2+d1)/k, 0.0, 1.0 );
    return mix( d2, -d1, h ) +  k*h*(1.0-h); 
}

float sdf(in vec3 p) {
    vec3 c1 = vec3(0., 1. + .25 * sin(4. * iTime) + 0.25 * sin(iTime * 4.), 0.);
    vec3 c2 = vec3(0., .5 - .25 * sin(4. * iTime) + 0.25 * sin(iTime * 4.), 0.);
    vec3 c3 = vec3(.25 * sin(2. * iTime), .75 + 0.25 * sin(iTime * 4.), 0.);
    vec3 c4 = vec3(-.25 * sin(2. * iTime), .75 + 0.25 * sin(iTime * 4.), 0.);
    vec3 b = vec3(0., .75 + 0.25 * sin(iTime * 4.), 0.);
    float r = .5;
    float sphere1 = sdSphere(p, c1, r);
    float sphere2 = sdSphere(p, c2, r);
    float sphere3 = sdSphere(p, c3, r);
    float sphere4 = sdSphere(p, c4, r);
    float plane = sdPlane(p);
    float box = sdBox(b - p, vec3(.5, .5, .5)); 
    float d = opSU(sphere1, sphere2, _sphereSmooth);
    d = opSU(d, sphere3, _sphereSmooth);
    d = opSU(d, sphere4, _sphereSmooth);
    d = opSS(d, box, .1);
    d = opSU(d, plane, .8);
    return d;
}

float rayMarching(in vec3 ro, in vec3 rd) {
    float dO = 0.;
    for (int i = 0; i < MAX_STEPS; i ++) {
        vec3 p = ro + rd * dO;
        float dS = sdf(p);
        dO += dS;
        if(dS < MIN_DISTANCE || dO > MAX_DISTANCE) break;
    }
    return dO;
}

vec3 getNormal(in vec3 p) {
    float d = sdf(p);
    vec2 e = vec2(MIN_DISTANCE, 0);
    return normalize(vec3(
        sdf(p + e.xyy) - d,
        sdf(p + e.yxy) - d,
        sdf(p + e.yyx) - d
        ));
}

float shadow(in vec3 ro, in vec3 rd, in float mint, in float maxt, in float k) {
    float res = 1.0;
    float h = mint;
    for(int i=0;i<200;++i){
        if (h>=maxt) break;
        vec3 p = ro + rd * h;
        float s = sdf(p);
        h += s;
        if (s <= MIN_DISTANCE) {
            return 0.0;
        }
        res = min(res, k * s / h);
    }
    return res;
}

vec3 getLight(in vec3 p) {
    vec3 n = getNormal(p);
    vec3 ld = normalize(_lightPos - p);
    vec3 ld2 = normalize(_lightPos2 - p);
    float lParallel = clamp(dot(n, -_lightDir), 0., 1.) * _parallelIntense;
    float lPoint = clamp(dot(n, ld), 0., 1.) * _pointIntense;
    float lPoint2 = clamp(dot(n, ld2), 0., 1.) * _pointIntense;
    lParallel = lParallel * pow(shadow(p, -_lightDir, _shadowMin, _shadowMax, _k), _shadowIntense);
    lPoint = lPoint * pow(shadow(p, ld, _shadowMin, _shadowMax, _k), _shadowIntense);
    lPoint2 = lPoint2 * pow(shadow(p, ld2, _shadowMin, _shadowMax, _k), _shadowIntense);
    
    return (lPoint + lParallel + lPoint2) * _lightColor;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    // Normalized pixel coordinates (from 0 to 1)
    vec2 uv = fragCoord/iResolution.xy - .5;
    uv.x *= iResolution.x / iResolution.y;
    vec3 ro = vec3(2. * sin(iTime / 2.), 0.5 , 5. * cos(iTime / 2.));
    vec3 lookAt = vec3(0, -0.5 * sin(iTime / 2.) + 1., 0.);
    vec3 col = vec3(0., 0., 0.);
    vec3 rd = getRay(ro, lookAt, uv);
	float d = rayMarching(ro, rd);
    vec3 p = ro + d * rd;
    // Output to screen
    fragColor = vec4(getLight(p), 1.);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}