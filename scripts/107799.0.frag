precision mediump float;

uniform float u_time;
uniform vec2 u_resolution;

// Функция для генерации случайного числа между 0 и 1
float random(float seed) {
  return fract(sin(seed) * 43758.5453);
}

void main() {
  // Определяем позицию пикселя
  vec2 p = (2.0 * gl_FragCoord.xy - u_resolution) / min(u_resolution.x, u_resolution.y);

  // Параметры для кружочков
  vec2 circles[5];
  circles[0] = vec2(-0.5, -0.5);
  circles[1] = vec2(0.5, -0.5);
  circles[2] = vec2(-0.5, 0.5);
  circles[3] = vec2(0.5, 0.5);
  circles[4] = vec2(0.0, 0.0);

  // Цвета для кружочков
  vec3 colors[5];
  colors[0] = vec3(1.0, 0.0, 0.0);
  colors[1] = vec3(0.0, 1.0, 0.0);
  colors[2] = vec3(0.0, 0.0, 1.0);
  colors[3] = vec3(1.0, 1.0, 0.0);
  colors[4] = vec3(1.0, 0.0, 1.0);

  // Параметры для движения и размытия
  float speed = 0.2;
  float blurAmount = 0.05;

  // Параметры для случайного движения
  float randomSeed = floor(u_time);

  // Отрисовка кружочков
  vec3 finalColor = vec3(0.0);
  for (int i = 0; i < 5; i++) {
    // Генерируем случайное смещение для текущего кружочка
    float offsetX = random(randomSeed + float(i)) * 2.0 - 1.0;
    float offsetY = random(randomSeed - float(i)) * 2.0 - 1.0;

    // Обновляем позицию кружочка с учетом смещения и времени
    vec2 circlePosition = circles[i] + vec2(offsetX, offsetY) * speed * u_time;

    // Вычисляем размытие для текущего кружочка
    float d = length(p - circlePosition);
    float alpha = smoothstep(0.5 - blurAmount, 0.5 + blurAmount, d);

    // Смешиваем цвета кружочка с фоном на основе альфа-канала
    finalColor += mix(colors[i], vec3(0.0), alpha);
  }

  // Вывод конечного цвета
  gl_FragColor = vec4(finalColor, 1.0);
}
