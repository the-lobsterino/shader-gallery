/*
 * Original shader from: https://www.shadertoy.com/view/mtcGzr
 */

#ifdef GL_ES
precision highp float;
#endif

// glslsandbox uniforms
uniform float time;
uniform vec2 resolution;


// shadertoy emulation
#define iTime time
#define iResolution resolution
vec4 iMouse = vec4(0.);

// --------[ Original ShaderToy begins here ]---------- //
precision mediump float;

float rectSDF(vec2 st, vec2 s) {
    st = st * 2.0 - 1.0;
    return max(abs(st.x / s.x), abs(st.y / s.y));
}

float fill(float x, float size) {
    return 1.0 - step(size, x);
}

float random(in vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 st = fragCoord.xy / iResolution.xy;
    vec2 xy = st;

    vec3 color = vec3(0.0);

    float r = random(st);

    vec2 s = vec2(0.7, 0.8);

    vec2 fpos = fract(st);

    float rPos = random(vec2(fpos.y)) * 5.0;

    xy.y = fract(xy.y * 100.0);
    xy.x -= mod(iTime * rPos * 0.2, 2.0) - 1.0;

    float rect = rectSDF(xy, s); 
    
    if (st.x >= max((iMouse.x / iResolution.x), 0.0)) {
        xy.y = st.y;
        xy.y += (xy.y * 2.0 - 1.0) * r * r * r;
        rect = rectSDF(xy, vec2(0.74));
        xy.y -= (xy.y * 2.0 - 1.0) * r * r * r ;
        float rectDif = rectSDF(xy, vec2(0.74));
        color += vec3(0.0, 0.0 * r, 0.0) * fill(rectDif, 1.0);
        color += vec3(0.2, 0.0 * r, 0.9) * fill(rect, 1.0); 
    } else {
        color += fill(rect, 1.0);
    }

    fragColor = vec4(color, 1.0);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{

    mainImage(gl_FragColor, gl_FragCoord.xy);
}