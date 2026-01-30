#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main() {
    float time = time;
    // move
    float range = 0.2;
    float move_x = sin(time * 0.4) * 3.5 - cos(time * 0.9) + cos(time * 2.1) * 0.1;
    float move_y = sin(time * 0.3) * 2.1 - cos(time * 1.5) + cos(time * 2.5) * 0.2;
    vec2 center = vec2(0.5 + cos(move_x) * range, 0.5 + sin(move_y) * range);
    
    // normalize
    vec2 res = resolution.xy;
    float w = res.x;
    float h = res.y;
    vec2 oguv = gl_FragCoord.xy / vec2((w * h) / w, h) - vec2((w - h) / (2.0 * h), 0.0) - center;

    // fisheye
    float center_dist = distance(oguv, vec2(0.0, 0.0));
    float stretch = (pow(center_dist + 1.0, 1.6) - 1.0) / center_dist;
    oguv = oguv * stretch;

    // zoom
    vec2 uv = (sin(time * 1.3) * 0.6 + 1.8) * oguv;

    // rotation
    float angle = sin(time * 0.3) * 3.1 - cos(time * 0.6) + cos(time * 2.1) * 0.1;
    uv = mat2(cos(angle), sin(angle), -sin(angle), cos(angle)) * uv;
    
    // multiples
    uv = fract(uv);

    // circles and glow
    float dist = smoothstep(0.05, 0.55, distance(uv.xy, vec2(0.5, 0.5)));
    float val = 1.0 / (10.0 * dist);

    // colors
    float scale = 0.8;
    float offset = time * 0.5;
    float change = 1.2;
    float r = scale * sin(offset + oguv.y * change) + scale;
    float g = scale * sin(offset + oguv.x * change) + scale;
    float b = scale * cos(offset + (oguv.x - oguv.y) * change) + scale;
    vec3 col = val * vec3(r, g, b);

    gl_FragColor = vec4(col,1.0);
}