#extension GL_OES_standard_derivatives : enable

precision mediump float;

uniform vec2 mouse;

uniform vec2 resolution;  // Разрешение экрана (размеры окна)
//uniform float progress;   // Прогресс от 0.0 до 1.0

void main() {
	float progress = mouse.x;
    vec2 position = (gl_FragCoord.xy / resolution) - vec2(0.5);
    float angle = atan(position.y, position.x);  // Угол пикселя относительно центра
    angle = mod(angle, 2.0 * 3.14159);  // Приводим угол к диапазону от 0 до 2π

    // Радиус круга
    float radius = 0.3;

    // Угол среза от 90 градусов до 350 градусов (по часовой стрелке)
    float cutoffAngle = progress * (2.0 * 3.14159 );

    // Заполнение круга цветом и срез от угла 90 градусов до 450 градусов
    vec3 color = vec3(1.0, 0.0, 0.0);  // Красный цвет по умолчанию

    if (length(position) <= radius && angle <= cutoffAngle) {
        color = vec3(0.0, 1.0, 0.0);  // Зеленый цвет внутри круга и в срезе
    }

    gl_FragColor = vec4(color, 1.0);
}