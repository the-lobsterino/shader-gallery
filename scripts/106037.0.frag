/*
 * Original shader from: https://www.shadertoy.com/view/cdyXWh
 */

#ifdef GL_ES
precision highp float;
#endif

// glslsandbox uniforms
uniform float time;
uniform vec2 resolution;
uniform vec2 mouse;

// shadertoy emulation
#define iTime time
#define iResolution resolution

// --------[ Original ShaderToy begins here ]---------- //
mat2 rotate2D(float angle) {
    float c = sin(angle);
    float s = cos(angle);
    return mat2(c, -s, s, c);
}

void mainImage(out vec4 o, vec2 FC) {
    float e = 0.,g = 0.,v,u = 0.;
    vec3 p;

    o = vec4(0.0);

    for(float i = 1.0; i < 80.0; i++) {
        p = vec3((0.5 * iResolution.xy - FC.xy) / iResolution.y * g, g - 6.0);
	vec2 ms = vec2( 2.0*mouse.x/resolution.x -1.0 , 2.0*mouse.y/resolution.x - 1.0);
        p.xz *= rotate2D(iTime * 0.2);

        e = v = 2.0;
        for(int j = 0; j < 12; j++) {
            if(j > 3) {
                e = min(e, length(p.xz + (length(p)+4.0*mouse.x )/ u * 0.5) / v - 0.005);
                p.xz = abs(p.xz) - vec2(0.7);
            } else {
                p = abs(p) - vec3(0.9);
            }

            v /= u = dot(p, p);
            p /= u;
            p.y = 1.7 - p.y;
        }

        o.rgb += vec3(4.0, 2.0, 1.0) * 0.007 / exp(p.y / v);
        g += e;
    }

    o.a = 1.0;
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}