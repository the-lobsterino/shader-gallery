/*
 * Original shader from: https://www.shadertoy.com/view/flfXzX
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
const float PI = 3.141592;

mat2 rotate2d(float _angle) {
    return mat2(cos(_angle), -sin(_angle), sin(_angle), cos(_angle));
}

float rand(vec2 n) {
    return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
}

struct di {
    vec2 p;
    vec2 i;
};

di devision(in vec2 p) {
    float dec = 4.;
    vec2 res = fract(p * dec);
    vec2 ind = floor(p * dec) / dec;
    float pl = abs(floor(sin(iTime))) * .3;
    for(float i = 0.; i < 4.; i++) {
        if(rand(ind + i) < .5) {
            dec *= 2.;
            res = fract(p * dec);
            ind = floor(p * dec) / dec;
        } else {
            break;
        }
    }
    return di(res, ind);
}

float circle(in vec2 p) {
    p -= vec2(.5);
    return floor(4. * dot(p, p));
}

float cros(in vec2 p) {
    p -= vec2(.5);
    float r = (abs(p.x) < .15) || (abs(p.y) < .15) ? 0. : 1.;
    return r;
}

float rcros(in vec2 p) {
    p -= vec2(.5);
    p *= rotate2d(PI / 4.);
    p += vec2(.5);
    return cros(p);
}

float box(in vec2 p) {
    p -= vec2(.5);
    return (abs(p.x) < .3) && (abs(p.y) < .3) ? 0. : 1.;
}

float ibox(in vec2 p) {
    return 1. - box(p);
}

vec2 movep(in vec2 p, in float r) {
    float t = cos(mod(iTime, PI));
    vec2 ep = p + (r < .5 ? vec2(t, 0.) : vec2(0., t));
    return fract(ep);
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    vec2 p = fragCoord / min(iResolution.x,iResolution.y);
    di dis = devision(p);
    p = dis.p;
    vec2 ind = dis.i;

    float d = 1., r;
    r = rand(ind * .11);

    p = movep(p, r);

    if(r < .2) {
        d = circle(p);
    } else if(r < .4) {
        d = cros(p);
    } else if(r < .6) {
        d = rcros(p);
    } else if(r < .8) {
        d = box(p);
    } else {
        d = ibox(p);
    }

    vec3 color = vec3(d);

    fragColor = vec4(color, 1.0);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}