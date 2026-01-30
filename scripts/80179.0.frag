/// TO THE PERSON WHO PROGRAMMED THIS: HOW DID YOU COME UP WITH THIS ? 

precision mediump float;

uniform vec2 resolution;
uniform float time;
uniform float mouseY;

float t = time * 0.4;
float s = 0.3 + sin(t) * 0.8;
vec2 scouse = vec2(tan(1.7 * t), cos(t) * 0.25 + 0.3);

void main() {
    vec3 p = vec3((2. * gl_FragCoord.xy - resolution.xy) / (resolution.y), scouse.x * 2.);

    for(int i = 0; i < 50; i++) {
         p = abs(((p) / dot(p, p) - vec3(1.02, 0.95, scouse.y * 0.7)));
    }

    if (length(p - vec3(1.)) > 20.) {
        p *= 0.5;
    } else {
        p *= 1.8;

        if (p.y > mouseY) {
            p -= 5.1;
        } else {
            p += 5.4;
        }

    }

    gl_FragColor = vec4(p, 3.);
}
