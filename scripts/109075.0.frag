#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    // Нормализуем координаты
    vec2 uv = fragCoord.xy / resolution.xy;

    // Создаем градиент из темного синего в фиолетовый
    vec3 color = vec3(0.1, 0.05, 0.2) + vec3(0.4, 0.3, 0.5) * uv.y;

    // Добавляем эффект анимации с использованием функции синуса
    color *= 0.5 + 0.5 * sin(time);

    // Отображаем цвет на экране
    fragColor = vec4(color, 1.0);
}

void main() {
    mainImage(gl_FragColor, gl_FragCoord.xy);
}