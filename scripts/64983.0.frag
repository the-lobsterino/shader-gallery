/*
 * Original shader from: https://www.shadertoy.com/view/wldXRB
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
#define time .5 * iTime
//#define ZPOS -30.
#define ZPOS -30. + 30. * time
#define XPOS 0.
#define YPOS 0.

float PI = acos(-1.);

mat2 rot2d(float a) {
    float c = cos(a), s = sin(a);
    
    return mat2(c, s, -s, c);
}

vec3 kifs(vec3 p, float tf1, float tf2, float s, float r) {
    float tr1 = floor(time) + smoothstep(0., .5, fract(time));
	float tr2 = floor(time) + smoothstep(.5, 1., fract(time));
    for (float i = 0.; i < 6.; i++) {
        p.xy *= rot2d(tf1 * tr1);
        p.yz *= rot2d(tf2 * tr2 - i);
        p = abs(p);
        p -= s;
        s *= r;
    }
    
    return p;
}

float sphere(vec3 p, float r) {
    return length(p) - r;
}

float box( vec3 p, vec3 b )
{
  vec3 q = abs(p) - b;
  return length(max(q,0.0)) + min(max(q.x,max(q.y,q.z)),0.0);
}

float cylinder(vec3 p, vec3 c) {
	return length(p.xy - c.xy) - c.z;   
}

vec3 rep(vec3 p, vec3 r) {
    vec3 q = mod(p, r) - .5 * r;
    
    return q;
}

float at = 0.;
float map(vec3 p) {
    p.xy *= rot2d(p.z / 100.);
    p = rep(p, vec3(35.));
    p.xy *= rot2d(sin(p.z * .2));
    float d = 500.;
    
    vec3 pk = kifs(p, .5, .3, 3., .7);
    float obj = max(
        // repeated shape interpolates between cylinder and box
        mix(
            cylinder(pk, vec3(.1, .05, .1)),
            box(pk, vec3(.2)),
          	.5 * sin(time * .6) + .5  
        ),
        // Intersection with a big sphere or box to
        // prevent the shape going to infinity
        mix(
            sphere(p, 12.),
            box(p, vec3(10)),
            .5 * sin(2. * time) + .5
        )
    );

    d = min(d, obj);
	at += .1 / (.2 + abs(d));
        
    return d;
}

vec3 glow = vec3(0);
float rm(vec3 ro, vec3 rd) {
    float swave = .5 * sin(.7 * time) + .5;
    float d = 0.;

    // The glow color interpolates between blue and red
    vec3 glowCol = mix(
        vec3(0., 0., .5),
        vec3(.5, 0., 0.),
        swave
    );
    
    for (int i = 0; i < 60; i++) {
        vec3 p = ro + d * rd;
        float ds = map(p);
        
        if (ds < .01 || ds > 100.) {
            break;
        }
        
        glow += 0.002 * at * glowCol;
        d += ds;
    }
    
    return d;
}

vec3 normal(vec3 p) {
    vec2 e = vec2(0.01, 0);
    
    vec3 n = normalize(map(p) - vec3(
        map(p - e.xyy),
        map(p - e.yxy),
        map(p - e.yyx)
	));

    return n;
}

float light(vec3 p) {
    vec3 lp = vec3(XPOS, YPOS, ZPOS);
    vec3 tl = lp - p;
    vec3 tln = normalize(tl);
    vec3 n = normal(p);
    float dif = dot(n, tln);
    float d = rm(p + .01 * n, tln);
    
    if (d < length(tl)) {
     	dif *= .1;   
    }
    
    return dif;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 uv = vec2(fragCoord.x / iResolution.x, fragCoord.y / iResolution.y);
    uv -= 0.5;
    uv /= vec2(iResolution.y / iResolution.x, 1);
	vec3 col = vec3(0);
    vec3 ro = vec3(XPOS, YPOS, ZPOS);
//    ro.x -= step(10. * time;
    vec3 rd = normalize(vec3(uv, 1.));
    float d = rm(ro, rd);
    vec3 p = ro + d * rd;
    float dif = light(p);
    
    col = .2 * dif + glow * vec3(sin(p.z / 10.));
    
    fragColor = vec4(col,1.0);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}