precision mediump float;


uniform float time;
uniform vec2 mouse;
uniform vec2 resolution; 

const float PI = 3.14159265;

void main() {
    vec2 uv = gl_FragCoord.xy / resolution.xy  - 0.5;
    uv.x *= resolution.x / resolution.y;


    
    float sw1 = sin(uv.x * 20.);
    float t = time * sign(sw1);
    
    float d = 0.6666666666666;
    float s = 17.;
    float sw2 = sin(uv.x * s + uv.y * s + t);
    float sw3 = sin(uv.x * s + uv.y * s - PI * d + t);
    float sw4 = sin(uv.x * s + uv.y * s + PI * d + t);
    

    vec3 color = vec3(0.);
    color.r = sin(sw2 * sw2) * sw1 * sw2;
    color.g = sin(sw3 * sw3) * sw1 * sw3;
    color.b = sin(sw4 * sw4) * sw1 * sw4;


    gl_FragColor = vec4(color,1.0);
}