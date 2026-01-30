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
//#define iMouse mouse

#ifdef GL_ES
precision lowp float;
#endif

// shadertoy emulation
#define iTime time
#define iResolution resolution
#define iMouse mouse*resolution
varying vec2 surfacePosition;

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    vec3 c;
    float l, z = iTime;
    for (int i = 0; i < 3; i++) {
        vec2 uv, p = surfacePosition*float(i) - fragCoord.xy / iResolution.xy;
        uv = p;
        //p -= .3;
        //p.x *= iResolution.x / iResolution.y;
        z += .07;

        // Use mouse input to modify the shader behavior
        uv += iMouse.xy / iResolution * 12.1; // Take the first two components of iMouse

        l = length(p);
        uv += p / l * (sin(z) + 7.0) * abs(sin(l * 5.0 - z - z));
        c[i] = .03 / length(mod(uv, 1.0) - 0.5);
    }
    fragColor = vec4(c / l, iTime);
}

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}
