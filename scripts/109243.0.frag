void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy; // Нормализуем координаты

    // Цвет фона
    vec3 backgroundColor = vec3(0.2, 0.2, 0.2); // Темно-серый фон

    // Позиция мыши и радиус освещения
    vec2 mouse = u_mouse.xy / u_resolution.xy; // Нормализуем координаты мыши
    float radius = 1; // Радиус эффекта свечения
    float len = distance(uv, mouse);
    
    // Создание эффекта свечения
    float glow = max(0.0, 1.0 - len / radius);
    vec3 glowColor = vec3(1.0, 1.0, 1.0); // Белый цвет
    vec3 finalColor = mix(backgroundColor, glowColor, glow);

    gl_FragColor = vec4(finalColor, 1.0); // Устанавливаем окончательный цвет
}
