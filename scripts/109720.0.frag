// Вершинный шейдер
struct VS_OUTPUT
{
    float4 pos : POSITION;
    float2 tex : TEXCOORD0;
};

VS_OUTPUT VS(float4 pos : POSITION)
{
    VS_OUTPUT output;
    output.pos = pos;
    output.tex = pos.xy * 0.5 + 0.5; // Преобразование координат в диапазон [0, 1]
    return output;
}

// Пиксельный шейдер
float4 PS(VS_OUTPUT input) : SV_Target
{
    float2 center = float2(0.5, 0.5); // Центр круга
    float radius = 0.5; // Радиус круга

    float2 offset = input.tex - center;
    float distance = length(offset);

    // Используем функцию atan2 для определения угла в полярных координатах
    float angle = atan2(offset.y, offset.x);

    // Вычисляем новые координаты с учетом эффекта волны-сферы
    float distortion = sin(distance * 10) * 0.1; // Параметры искажения могут быть настроены по вашему усмотрению
    float newRadius = radius + distortion;
    float2 distortedCoord = center + float2(cos(angle) * newRadius, sin(angle) * newRadius);

    // Рисуем круг (или другую фигуру) без использования текстуры
    float insideCircle = smoothstep(newRadius - 0.01, newRadius, distance);
    float4 color = float4(1, 0, 0, 1); // Красный цвет

    return color * insideCircle;
}