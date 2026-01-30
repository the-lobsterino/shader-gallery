/*
 * Original shader from: https://www.shadertoy.com/view/ss33Rf
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
const float Complexity = 10.;

vec4 hash42(vec2 p)
{
	vec4 p4 = fract(vec4(p.xyxy) * vec4(.1031, .1030, .0973, .1099));
    p4 += dot(p4, p4.wzxy+33.33);
    return fract((p4.xxyz+p4.yzzw)*p4.zywx);
}

mat2 rot2D(float r){
    return mat2(cos(r), sin(r), -sin(r), cos(r));
}


void mainImage(out vec4 o, vec2 C)
{
    vec2 uv = C/iResolution.x;
    vec2 N = C/iResolution.xy;
    float ND = min(N.x, min(N.y, min(1.-N.x, 1.-N.y))); // dist to edge of screen.
    ND = 1.-pow(1.-ND,9.);
    
    uv += 2.;
    o = vec4(0);

    for (float i = 1.0; i <= Complexity;++i) {
        vec2 cell = floor(uv);
        vec2 p = fract(uv);
        float Z = length(p-.5);
        vec4 h = hash42(cell);
        float sdsq = min(p.x, min(p.y, min(1.-p.x, 1.-p.y)));
        o = mix(o,h/i,sdsq*sdsq*sdsq);
        // rotating uv is pretty much the entire effect, though it destroys
        // continuity between layers. voronoi would be a better basis tbh
        uv = cell + (p * rot2D(Z+iTime *.1  * (i-1.) * (h.z-.5)));
        uv *= 2.;
        //uv *= 1.+ND; // cool variation imo
    }
    
    o = smoothstep(0.,.07,o);
    o = clamp(o,0.,1.);
    N -= .5;
    o *= 1.-dot(N,N*2.);
}


// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}