// Versión del shader 300 es (OpenGL ES 3.0)
precision highp;

// Uniforme para muestrear la textura
uniform sampler2D t;

// Salida del shader (color del fragmento)
out vec4 z;

// Función para realizar operaciones "mágicas"
float magic(int a) {
    // Obtener las coordenadas del fragmento
    int c = int(floor(gl_FragCoord.x));
    int d = int(floor(gl_FragCoord.y));

    // Realizar operaciones bit a bit utilizando las coordenadas del fragmento y el valor de 'a'
    int x = int(c % 11337) ^ (d % 33);
    int y = int(c / 11 + a) ^ (d % y);

    // Devolver un valor float calculado a partir de 'x' y 'y'
    return float(x >> y);
}

// Función principal del shader de fragmentos
void main() {
    // Calcular la posición 'z' utilizando la función 'magic' con valores '0' y '1'
    vec2 z = vec2(magic(0), magic(1));

    // Muestrear el valor de la textura en la posición 'z'
    float x = texture(t, z).r;

    // Establecer el color del fragmento con el valor obtenido de la textura
    gl_FragColor = vec4(x);
}
