#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
#define period 5.0
#define speed 0.1
#define duration 1.25

#define gradient_color1 vec4(0.21, 0.67, 0.82, 1)
#define gradient_color2 vec4(0.36, 0.09, 0.77, 1.0)

#define grid_radius 20.0
#define grid_border 5.0
#define grid_margin 2.0
#define grid_color vec4(0.27, 0.21, 0.78, 0.75)

float sineWave(float offset, float p) {
    return (sin((time / p + offset) * 2.0 * 3.1415926) + 1.0) / 2.0;
}

float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.865);
}

vec4 grid(vec2 tc, vec2 texSize) {
    vec4 returnColor;

    float halfSize = grid_radius + grid_border + grid_margin;
    vec2 gridOffset = vec2(abs(mod(tc.x - texSize.x / 2.0, halfSize * 2.0) - halfSize), abs(mod(tc.y - texSize.y / 2.0, halfSize * 2.0) - halfSize));
    if (gridOffset.x < grid_radius && gridOffset.y < grid_radius) {
        returnColor = grid_color;
    } else if (gridOffset.x < grid_radius + grid_border && gridOffset.y < grid_radius + grid_border) {
        returnColor = vec4(grid_color.rgb, grid_color.a * max(0.0, 1.0 - length(vec2(max(0.0, gridOffset.x - grid_radius), max(0.0, gridOffset.y - grid_radius))) / grid_border));
    } else {
        returnColor = vec4(0.0, 0.0, 0.0, 0.0);
    }

    float rnd = random(vec2(abs(floor((tc.x - texSize.x / 2.0) / (halfSize * 2.0))), abs(floor((tc.y - texSize.y / 2.0) / (halfSize * 2.0)))));
    return vec4(returnColor.rgb, returnColor.a * pow(0.3 + 0.7 * sineWave(rnd, period * (0.5 + rnd)), 1.5));
}


vec4 gradient(vec2 tc, vec2 texSize) {
    float dist1 = length(tc - texSize / 2.0);
    float dist2 = length(texSize) / 2.0;

    return gradient_color1 * (dist2 / (dist1 + dist2)) + gradient_color2 * (dist1 / (dist1 + dist2));
}

vec4 grid_texture(vec2 uv) {
    vec2 texSize = resolution;
    vec2 tc = uv * texSize;

    vec4 gradientColor = gradient(tc, texSize);
    vec4 gridColor = grid(tc, texSize);

    float alpha = 1.0;

    return vec4((gradientColor * (1.0 - gridColor.a) + gridColor * gridColor.a).rgb, alpha);
}



void main( void ) {
    float t = mod(time, duration / speed) * speed;

    vec2 tc = gl_FragCoord.xy / resolution.xy;
    vec2 tc_circular = vec2(gl_FragCoord.x - (resolution.x - resolution.y) / 2.0, gl_FragCoord.y) / vec2(resolution.y, resolution.y);
    vec2 wavePos = -0.7 + 1.4 * tc_circular;
    float waveOffset = length(wavePos);

    vec2 uv = tc - (wavePos/pow(abs(waveOffset), 1.0)) * cos(min(3.1415926 * 3.0, pow(waveOffset / t, 2.0) * t * 5.0)) * t * 0.5;

    gl_FragColor = grid_texture(uv);

}