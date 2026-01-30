#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float render(vec2 position, int letter, float xoff)
{
    float color = 0.;
    for (int y = 0; y < 5; y++)
    for (int x = 0; x < 5; x++)
    {
        float row = 0.5 + .005 * float(y);
        float col = xoff - .005 * float(x);
        int digit = letter / int(pow(2., float(y * 5 + x)));
        if (digit != digit / 2 * 2
            && (col <= position.x) && (col + .005 >= position.x)
            && (row <= position.y) && (row + .005 >= position.y))
            color = 1.;
    }
    return color;
}

void main(void)
{

    vec2 position = gl_FragCoord.xy / resolution.xy;
    float color = .0;
    int
        letter1 = 0x1F87E10, letter2 = 0x118C62E,
        letter3 = 0x1F8421F, letter4 = 0x13A6293,
        letter5 = 0x1151084, letter6 = 0x1F8C63F,
        letter7 = 0x118C62E;
    position.y += .25 * sin(position.x * 4. + time * 2.);
    color += render(position, letter1, .05 + 0.4);
    color += render(position, letter2, .05 + 0.43);
    color += render(position, letter3, .05 + 0.46);
    color += render(position, letter4, .05 + 0.49);
    color += render(position, letter5, .05 + 0.54);
    color += render(position, letter6, .05 + 0.57);
    color += render(position, letter7, .05 + 0.60);
    gl_FragColor = vec4(sin(color + position.y), cos(color - position.x), sin(color + position.x), 1.);
}