precision highp float;

const float MAX_STEPS = 360.0;

uniform vec2 resolution;
uniform float time;

vec3 hue2rgb(float hue) {
    return clamp( 
        abs(mod(hue * 6.0 + vec3(0.0, 4.0, 2.0), 6.0) - 3.0) - 1.0, 
        0.0, 1.0);
}

vec4 render(float t, vec2 p)
{
    vec2 z = vec2(0.0);

    // p = p * pow(t, -2.0) + vec2(-0.725, 0.25);

    float x = 0.0;
    for(float i = 0.0; i < MAX_STEPS; i++) {
        x += 1.0;
        if (dot(z, z) >= 1024.0) {
            break;
        }
        z = vec2(z.x * z.x - z.y * z.y, 2.0 * z.x * z.y) + p;
    }

    float hue = x / MAX_STEPS;
    return vec4(hue2rgb(x / MAX_STEPS), 1.0);;
}

void main( void ) {
    vec2 p = 2.0 * (gl_FragCoord.xy / resolution.xy - 0.5) * resolution.xy / resolution.y;
    gl_FragColor = render(time, p);
}
