
#ifdef GL_ES
precision mediump float;
#endif

// glslsandbox uniforms
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

// shadertoy emulation
#define iTime time
#define iMouse mouse
#define iResolution resolution

float Cube(in vec3 p) {
    vec3 q = abs(p) - 0.75;
    return max(q.x, max(q.y, q.z));
}

float mapScene(in vec3 p) {
    float c = cos(3.*iTime), s = sin(3.*iTime);
    p.xz *= mat2(c, -s, s, c);
    p.yz *= mat2(c, -s, s, c);

    return (Cube(p + vec3(-0.5,  0.0,  0.0)) +
            Cube(p + vec3( 0.5,  0.0,  0.0)) +
            Cube(p + vec3( 0.0, -0.5,  0.0)) +
            Cube(p + vec3( 0.0,  0.5,  0.0)) +
            Cube(p + vec3( 0.0,  0.0, -0.5)) +
            Cube(p + vec3( 0.0,  0.0,  0.5))) / 6.0 + 0.08;
}

vec3 getNormal(in vec3 p) {
    vec3 e = vec3(0.001, 0.0, 0.0);
    return normalize(vec3(mapScene(p + e.xyy) - mapScene(p - e.xyy),
                          mapScene(p + e.yxy) - mapScene(p - e.yxy),
                          mapScene(p + e.yyx) - mapScene(p - e.yyx)));
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    vec2 uv = (fragCoord - 0.5 * iResolution.xy) / iResolution.y;
    
vec2 m = mouse*resolution;
	m = ( m    - .5 * resolution.xy)/resolution.y;
	uv -= m;
	fragColor = vec4(0.0, 0.0, 0.0, 1.0);

    vec3 ro = vec3(0.0, 0.0, 5.0);
    vec3 rd = normalize(vec3(uv, -1.0));

    float t = 0.0;
    for (int i=0; i < 100; i++) {
        vec3 p = ro + rd * t;
        float d = mapScene(p / 2.0) * 2.0;
        if (d < 0.001) {
            vec3 n = getNormal(p / 2.0);
            vec3 l = vec3(-0.58, 0.58, 0.58);
            fragColor.rgb += n * max(0.2, dot(n, l));
            break;
        }

        if (t > 100.0) {
            break;
        }

        t += d;
    }
	
}
void main(void)
{
    mainImage(gl_FragColor,gl_FragCoord.xy);
}
