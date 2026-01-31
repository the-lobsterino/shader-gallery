#ifdef GL_ES
precision mediump float;
#endif

uniform float time; // Время для создания анимации
uniform vec2 resolution; // Разрешение экрана

void mainImage(out vec4 fragColor, in vec2 fragCoord)
{
    // Нормализуем координаты
    vec2 uv = fragCoord.xy / resolution.xy;
    
    // Простая анимация с использованием времени
    float animation = sin(time * 2.0);
    
    // Создаем эффект свечения с использованием шума
    float glow = 0.5 + 0.5 * sin(uv.x * 10.0) * sin(uv.y * 10.0);
    
    // Добавим волнение
    float wave = sin(uv.x * 10.0 + time * 2.0) * sin(uv.y * 10.0 + time * 2.0);
    
    // Цвет карты
    vec3 cardColor = vec3(0.0, 0.5, 1.0); // Синий цвет карты
    
    // Коррекция цвета и добавление эффектов
    vec3 color = cardColor + vec3(1.0, 1.0, 1.0) * glow * 0.2;
    
    // Добавление волнения
    color += vec3(0.0, 0.0, 0.2) * wave * 0.1;
    
    // Применяем анимацию к цвету
    color *= 1.0 + animation * 0.2;
    
    // Устанавливаем цвет фрагмента
    fragColor = vec4(color, 1.0);
}

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}
