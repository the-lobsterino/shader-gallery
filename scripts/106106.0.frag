#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

int MAX_STEPS = 10;
float MIN_DISTANCE = 0.1;

float sphereWithSpiral(vec3 p) {
    // Обчислити відстань від точки p до центра сфери
    float distanceToSphere = length(p) - 1.0;

    // Обчислити спіраль всередині сфери
    float spiral = sin(p.y * 5.0) * 0.2 * length(p.xz);

    // Додати спіраль до відстані до сфери
    return distanceToSphere + spiral;
}

vec3 raymarch(vec3 ro, vec3 rd) {
    float totalDistance = 0.0;
    for (int i = 0; i < 10; i++)
    {
        vec3 p = ro + rd * totalDistance;
        float distance = sphereWithSpiral(p); // Викликаємо функцію для обчислення відстані до сцени

        // Якщо ми дуже близько до об'єкта, завершуємо цикл
        if (distance < MIN_DISTANCE)
            break;

        totalDistance += distance;

        // Обмеження кількості ітерацій, щоб уникнути безкінечного циклу
        if (i >= MAX_STEPS)
            break;
    }
    
    // Повертаємо точку зіткнення
    return ro + rd * totalDistance;
}


void main( void ) {

	vec2 pos = ( 2. * gl_FragCoord.xy / resolution.xy ) / min(resolution.y, resolution.x);
	vec3 cameraPosition = vec3(0.0, 0.0, -3.0);
	vec3 rayDirection = normalize(vec3(pos.x, pos.y, 1.0));

	vec3 intersectionPoint = raymarch(cameraPosition, rayDirection);
	gl_FragColor = vec4(pos, 1.0, 1.0 );

}