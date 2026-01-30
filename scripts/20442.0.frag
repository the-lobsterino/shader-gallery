#ifdef GL_ES
precision mediump float;
#endif

// Giati grafeis Rwsika? LOL

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D iChannel0; //размываемая текстура

//uniform vec2 direction; //направление размытия, всего их три: (0, 1), (0.866/aspect, 0.5), (0.866/aspect, -0.5), все три направления необходимо умножить на желаемый радиус размытия

varying vec2 vTexCoord; //входные текстурные координаты фрагмента

void main() {
	vec2 uv = ( gl_FragCoord.xy / resolution.xy );
    vec4 sum = vec4(0.0); //результирующий цвет
    vec4 msum = vec4(0.0); //максимальное значение цвета выборок

	float samplesf = 1000.0;
	const int samplesi = 100;
	
	float bokeh = 0.5;

	vec2 direction = vec2(0.0, 50.0);
    float delta = 1.0/samplesf; //порция цвета в одной выборке
    float di = 1.0/(samplesf-1.0); //вычисляем инкремент
	
//    for (float i=-0.5; i<0.501; i+=di) 
	int smpls = int(samplesf);
	
	for (int i = 0; i < samplesi; ++i)
    {
	float di = -0.5 + float(i)*(1.0 / (samplesf - 1.0));
        vec4 color = texture2D(iChannel0, uv + direction * di); //делаем выборку в заданном направлении
        sum += color * delta; //суммируем цвет
        msum = max(color, msum); //вычисляем максимальное значение цвета
    }

    gl_FragColor = mix(sum, msum, bokeh); //смешиваем результирующий цвет с максимальным в заданной пропорции
}