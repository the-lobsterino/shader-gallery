#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;

void main(void) {
    // Calcula a posição do fragmento em coordenadas de tela
    vec4 pos = projectionMatrix * modelViewMatrix * vec4(gl_FragCoord.xyz, 1.0);
    vec2 position = pos.xy / pos.w;

    // Calcula a distância do fragmento à câmera
    float distance = length(position);

    // Define a cor base (nesse caso, um tom de azul)
    vec3 baseColor = vec3(0.5, 0.7, 1.0);

    // Calcula a intensidade da neblina com base na distância
    float fogIntensity = smoothstep(500.0, 800.0, distance);

    // Combina a cor base com a cor da neblina
    vec3 finalColor = mix(baseColor, vec3(1.0), fogIntensity);

    // Atribui a cor final ao fragmento
    gl_FragColor = vec4(finalColor, 1.0);
}