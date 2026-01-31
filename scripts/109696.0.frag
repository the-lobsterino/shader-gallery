#ifdef GL_ES
precision highp float;
#endif

uniform float time; // текущее время для анимации
varying vec3 vPosition; // позиция вершины, переданная из вершинного шейдера

// Функция генерации шума Перлина
float perlinNoise(vec3 pos) {
    return fract(sin(dot(pos ,vec3(12.9898,78.233,45.5432))) * 43758.5453);
}


void main() {
    float noiseValue = perlinNoise(vPosition + time);
    float dissolveThreshold = sin(time) * 0.5 + 0.5; // Пример изменения порога со временем

    // Интерполирование альфа-канала в зависимости от шума и порога растворения
    float alpha = smoothstep(dissolveThreshold - 0.1, dissolveThreshold, noiseValue);

    // Установка цвета с учетом альфа-канала
    gl_FragColor = vec4(1.0, 1.0, 1.0, alpha);
}