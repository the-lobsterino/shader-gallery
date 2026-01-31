
#extension GL_OES_standard_derivatives : enable
 
precision highp float;


uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main()
{
    vec2 uv = gl_FragCoord.xy / resolution;
    vec2 size = vec2(20.0, 10.0);
    float radius = 6.0;
    
    // Вычисляем координаты точки внутри закругленного прямоугольника
    vec2 roundedPos = abs(uv - size * 0.5) - vec2(size.x - radius, size.y - radius) * 0.5;
    
    // Вычисляем расстояние от точки до края закругленного прямоугольника
    float distance = length(max(roundedPos, 0.0)) - radius;
    
    // Рисуем закругленный прямоугольник

    if (distance < 0.0) {
        gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0); // Красный цвет
    } else {
        gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0); // Черный цвет
    }
}