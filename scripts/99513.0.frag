#ifdef GL_ES
precision mediump float;
#endif

uniform vec3 resolution;
uniform float time;
uniform vec3 playerPos;

void main()
{
    vec3 position = (gl_FragCoord.xyz / resolution.xyz) * 2.0 - 1.0;
    float colorSwitch = mod(time / 5.0, 1.0);
    vec3 color = vec3(colorSwitch, 1.0 - colorSwitch, 0.5);
    
    float distanceToPlayer = length(position - playerPos);
    if (distanceToPlayer < 0.1) {
        color = vec3(1.0, 0.0, 0.0);
    } else if (length(position.xy) < 0.5) {
        color = vec3(0.0, 1.0, 0.0);
    }

    gl_FragColor = vec4(color, 1.0);
}
