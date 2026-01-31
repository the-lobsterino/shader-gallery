#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 resolution;

vec4 snow(vec2 uv, float scale) {
    float w = smoothstep(20.0, 0.0, -uv.y * (scale / 20.0));
    if (w < 0.1) return vec4(0.0); // Возвращаем полностью прозрачный цвет для "прозрачных" частиц
    uv += time / scale;
    uv.y += time * 0.1 / scale; // Уменьшаем скорость падения снежинок
    uv.x += sin(uv.y + time * 199.1) / scale;
    uv *= scale;
    vec2 s = floor(uv), f = fract(uv), p;
    float k = 3.0, d;
    p = 0.5 + 0.25 * sin(11.0 * fract(sin((s + p + scale) * mat2(7, 3, 6, 5)) * 5.0)) - f; // Уменьшаем амплитуду движения
    d = length(p);
    k = min(d, k);
    k = smoothstep(0.0, k, sin(f.x + f.y) * 0.01);
    return vec4(1.0, 1.0, 1.0, k); // Возвращаем белый цвет для "активных" частиц с альфа-каналом k
}

void main(void) {
    vec2 uv = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);
    vec4 finalColor = vec4(0.0); // Изначально установим полностью прозрачный цвет фона

    // Вызов функции snow для различных параметров scale
    
    
    finalColor += snow(uv, 9.0);
    finalColor += snow(uv, 7.0);

    gl_FragColor = finalColor;

}