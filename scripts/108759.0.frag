#ifdef GL_ES
precision lowp float;
#endif

// glslsandbox uniforms
uniform float time;
uniform vec2 resolution;
uniform vec2 mouse; // Added mouse input

// shadertoy emulation
#define iTime time
#define iResolution resolution
#define iMouse mouse

#ifdef GL_ES
precision lowp float;
#endif

// shadertoy emulation
#define iTime time
#define iResolution resolution
#define iMouse mouse

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    vec3 c;
    float l, z = iTime;
    for (int i = 0; i < 3; i++) {
        vec2 uv, p = fragCoord.xy / iResolution.xy;
        uv = p;
        p -= 0.5;
        p.x *= iResolution.x / iResolution.y;
        z += 0.07;

        // Use mouse input to modify the shader behavior
        uv += iMouse.xy / iResolution * 0.1; // Take the first two components of iMouse

        l = length(p);
        uv += p / l * (sin(z) + 66.0) * abs(sin(l * 9.0 - z - z));
        c[i] = 0.01 / length(mod(uv, 1.0) - 0.5);
    }
    fragColor = vec4(c / l, iTime);
}

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}
