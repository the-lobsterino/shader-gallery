#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform float bpm;
uniform float targetBpm;
uniform vec2 resolution;

void main()
{
    float dt = time - floor(time);
    float bpm = mix(bpm, targetBpm, dt);
    vec2 p = (gl_FragCoord.xy / resolution.xy);
    p -= 0.5;
    p.x *= resolution.x / resolution.y;
    float amplitude = 0.1;
    float frequency = bpm / 60.0;
    p.y += amplitude * sin(time * frequency);
    vec3 color = vec3(1, 1, 1);
    float letterSpacing = 0.05;
    float fontSize = 0.1;
    float letter = length(p / fontSize);
    float border = 0.03;
    float r = smoothstep(letter - border, letter, length(p));
    color = mix(vec3(1,1,1), vec3(0,0,0), r);
    color = mix(color, vec3(1,0,0), step(letter - letterSpacing, letter));
    gl_FragColor = vec4(color, 1.0);
}
