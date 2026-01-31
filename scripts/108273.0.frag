#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main(void) {
    vec2 position = (gl_FragCoord.xy / resolution.xy) * 2.0 - 1.0;
    position.x *= resolution.x / resolution.y;

    float Kd = 0.8;
    vec3 lightDir = normalize(vec3(0.0, 0.0, 1.0));
    vec3 normal = vec3(0.0, 0.0, 1.0);
    
    float diff = max(0.0, dot(normal, lightDir));
    vec3 diffuse = diff * vec3(Kd);

    gl_FragColor = vec4(diffuse, 1.0);
}
