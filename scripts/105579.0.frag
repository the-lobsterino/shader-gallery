#ifdef GL_ES
precision highp float;
#endif

uniform float time;
uniform vec2  resolution;

#define PI 3.14
#define AUDIO_INTENSITY 0.3  // Puedes cambiar este valor para simular diferentes intensidades

mat2 rotate3d(float angle)
{
    return mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
}

void main() {
    vec2 p = (gl_FragCoord.xy * 1.0 - resolution) / min(resolution.x, resolution.y);
    
    // Rotación del elemento
    p *= rotate3d(time * 0.7 * PI);
    
    // Identificar el fragmento que representa el elemento que se desplaza alrededor del semicírculo
    if (length(p) > 0.95 && length(p) < 1.05) {
        // Aplicar oscilación tipo "movimiento de serpiente" aún más sutil solo a ese elemento
        p.y += sin(10.0 * p.x + time) * AUDIO_INTENSITY * 0.01;  // La magnitud se redujo aún más
    }
    
    float t;
    t = 0.075 / abs(1.0 - length(p));
    gl_FragColor = vec4(vec3(t) * vec3(0.10*(sin(time)+1.0), p.y*0.2, 2.0), 1.0);
}