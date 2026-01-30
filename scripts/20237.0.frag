precision highp float; 
uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;
const float pi = 3.141592653589793;
#define iter 100
void main() { 
    vec2 p = gl_FragCoord.xy / resolution;
    p = 2.0 * p - 1.0;
    p *= 1.25;
    p.x *= resolution.x / resolution.y;
    float t = mod(time * 10.0, float(iter));
    t = abs(t - float(iter) * 0.5) * 2.0;
    vec2 z = p;
    vec3 col = vec3(0.0);
    vec2 ms = mouse.xy * 2.0 - 1.0;
    for(int i = 0; i < iter; i++) {
        if(i < int(t)) 
        {
            z = vec2(z.x*z.x - z.y*z.y, 2.0*z.x*z.y) + vec2(ms.x, ms.y);
            col.r = 0.5 + z.x;
           
            //col.g = 0.5 + z.x;
            if(dot(z,z) > 0.0) {
                col.b = sin(float(i) / float(iter) * pi * 2.0);
            }
        }
    }
    gl_FragColor = vec4(col, 1.0);
}