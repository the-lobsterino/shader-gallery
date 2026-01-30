precision highp float;

uniform float time;
uniform vec2 resolution;

#define TAU 6.28318530718

float sinf(float x)
{
    x*=0.159155;
    x-=floor(x);
    float xx=x*x;
    float y=-6.87897;
    y=y*xx+33.7755;
    y=y*xx-72.5257;
    y=y*xx+80.5874;
    y=y*xx-41.2408;
    y=y*xx+6.28077;
    return x*y;
}

float cosf(float x)
{
    return sinf(x+1.5708);
}

void main( void )
{
	float time = time * 0.2;
	vec2 uv = gl_FragCoord.xy / resolution;

    vec2 p = mod(uv*TAU, TAU)-250.0;

	vec2 i = vec2(p);
	float c = 1.0;
	float inten = .005;

    float t = time * (1.0 - 3.5);
    i = p + vec2(cosf(t - i.x) + sinf(t + i.y), sinf(t - i.y) + cosf(t + i.x));
	c += 1.0/length(vec2(p.x / (sinf(i.x+t)/inten),p.y / (cosf(i.y+t)/inten)));

    t = time * (1.0 - (3.5 / 2.0));
    i = p + vec2(cosf(t - i.x) + sinf(t + i.y), sinf(t - i.y) + cosf(t + i.x));
	c += 1.0/length(vec2(p.x / (sinf(i.x+t)/inten),p.y / (cosf(i.y+t)/inten)));

	c /= 2.0;
    c = 1.0 - sqrt(c);

    vec4 colour = vec4(c, c - 0.2, c + 0.1, 1.0);
    colour = clamp(colour, 0.0, 1.0);

	gl_FragColor = colour;
}
