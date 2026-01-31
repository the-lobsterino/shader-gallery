#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main() {
    vec2 uv = (gl_FragCoord.xy / resolution.xy);
    uv -= 0.5;

    // Добавляем движущиеся шумовые текстуры
    vec2 p = uv * 10.0;
    float displacement = cos(p.x + p.y + time) + sin(p.x - p.y + time);
    vec3 color = vec3(0.5 + 0.5 * sin(time), 0.5 + 0.5 * cos(time + 2.0), 0.5 - 0.5 * sin(time + 0.5));
    uv += displacement * 0.1;

    // Создаем плавный градиент
    vec3 gradient = vec3(uv.x, uv.y, 1.0 - length(uv));
    
    // Комбинируем цвета и текстуры
    color = mix(color, gradient, 0.5);

    gl_FragColor = vec4(color, 1.0);
}