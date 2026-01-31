
#ifdef GL_ES
precision mediump float;
#endif
#extension GL_OES_standard_derivatives : enable

#define PI2 6.28318530718
#define MAX_ITER 5

uniform float time;
uniform vec2 resolution;



void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    float time = time * .12;
    vec2 uv = fragCoord.xy / resolution.xy;

    vec2 p = mod(uv * PI2, PI2) - 254.0  ;
    vec2 i = vec2(p);
    float c = 1.2;
    float inten =  0.0064;

    for (int n = 0; n < MAX_ITER; n++) {
        float t = time * (1.0 - (7.2 / float(n + 1)));
        i = p + vec2(cos(t - i.x) + sin(t - i.y), sin(t - i.y) + cos(t + i.x));
        c += 1.0 / length(vec2(p.x / (sin(i.x + t) / inten), p.y / (cos(i.y + t) / inten)));
    }

    c /= float(MAX_ITER);
    c = 1.23-pow(c, 1.22);
    vec3 colour = vec3(0.1+pow(abs(c),19.2), 0.1+pow(abs(c),50.2), 0.12+pow(abs(c), 5.0));

    fragColor = vec4(colour, 1);
}


void main( void ) {
    mainImage(gl_FragColor, gl_FragCoord.xy);
}