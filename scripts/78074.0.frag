#version 110

uniform sampler2D texture; //размываемая текстура
uniform vec2 direction; //направление размытия, всего их три: (0, 1), (0.866/aspect, 0.5), (0.866/aspect, -0.5), все три направления необходимо умножить на желаемый радиус размытия
uniform float samples; //количество выборок, float - потому что операции над этим параметром вещественные
uniform float bokeh; //сила эффекта боке [0..1]

varying vec2 vTexCoord; //входные текстурные координаты фрагмента

void main() {
	vec4 sum = vec4(0.0); //результирующий цвет
	vec4 msum = vec4(0.0); //максимальное значение цвета выборок

	float delta = 1.0/samples; //порция цвета в одной выборке
	float di = 1.0/(samples-1.0); //вычисляем инкремент
	for (float i=-0.5; i<0.501; i+=di) {
		vec4 color = texture2D(texture, vTexCoord + direction * i); //делаем выборку в заданном направлении
		sum += color * delta; //суммируем цвет
		msum = max(color, msum); //вычисляем максимальное значение цвета
	}

	gl_FragColor = mix(sum, msum, bokeh); //смешиваем результирующий цвет с максимальным в заданной пропорции
}