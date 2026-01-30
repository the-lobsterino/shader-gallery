/*
 * Original shader from: https://www.shadertoy.com/view/sljXz1
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
// https://twitter.com/kamoshika_vrc/status/1418594024475136002

#define D(Q) abs(dot(sin(Q), cos(Q.yzx)))

mat3 rotate3D(float angle, vec3 axis){
    vec3 a = normalize(axis);
    float s = sin(angle);
    float c = cos(angle);
    float r = 1.0 - c;
    return mat3(
        a.x * a.x * r + c,
        a.y * a.x * r + a.z * s,
        a.z * a.x * r - a.y * s,
        a.x * a.y * r - a.z * s,
        a.y * a.y * r + c,
        a.z * a.y * r + a.x * s,
        a.x * a.z * r + a.y * s,
        a.y * a.z * r - a.x * s,
        a.z * a.z * r + c
    );
}

vec3 hsv(float h, float s, float v) {
    vec4 a = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(vec3(h) + a.xyz) * 6.0 - vec3(a.w));
    return v * mix(vec3(a.x), clamp(p - vec3(a.x), 0.0, 1.0), s);
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 uv = (fragCoord * 2. - iResolution.xy) /min(iResolution.x, iResolution.y);
    vec3 col = vec3(0);
    
    vec3 P = vec3(0, 0, 2);
    vec3 ray = normalize(vec3(uv, -2.));
    
    float d = 0.;
    float c = 0.;
    for(int i=0; i<22; i+=1) {
        vec3 Q = P * rotate3D(iTime/10., vec3(0.1));
        d = length(Q) - .8;
        Q *= 10.;
        d = max(d, (D(Q) - .3) / 10.);
        Q *= 10.;
        d = max(d, (D(Q) - .3) / 100.);
        if(d < 1e-4) {
            break;
        }
        P += ray * d * .6;
        c++;
    }
    col += hsv(.3 - length(P), .7, 20./c);
    
    fragColor = vec4(col, 1.0);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}