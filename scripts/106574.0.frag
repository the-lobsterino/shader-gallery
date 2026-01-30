#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 resolution;

void mainImage(out vec4 fragColor, in vec2 fragCoord)
{
    // Нормализация координат
    vec2 uv = (2.0 * fragCoord - resolution.xy) / resolution.y;
  
    // Создание шума с использованием градиентного шума
    float noise = 0.5 + 0.5 * sin(uv.x * 10.0 + uv.y * 10.0 + time);
    
    // Создание цвета с использованием различных переходов и шума
    vec3 color = vec3(noise * uv.x, noise * uv.y, noise);
  
    fragColor = vec4(color, 1.0);
}