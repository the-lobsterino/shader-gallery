precision mediump float;
uniform float time;
uniform vec2 mouse, resolution;

#define R(t) mat2(cos(t + vec4(0, 33, 11, 0)))
float f(vec2 p)
{
    p *=8.0;
    float h=-0.0;
    float  d=0.0;
    float t = time*0.025;
    for (int i = 0; i <2; i++)
    {
        vec2 v = mod(p + t, 2.) - 1.; 
        d = max(0.0, .5 - max(abs(v.x), abs(v.y)));
        h += d;
        p *= R(t) * max(0., 0.5-dot(d, d));
	    p*=4.0;
	    //h+=sin(time*4.0+p.x)*0.2;
    }
    return h;
}
void main()
{
    vec2 p = (gl_FragCoord.xy - .5 * resolution) / min(resolution.x, resolution.y);
    float n = f(p) + f(vec2(2. + p.x, -p.y)) + f(vec2(p.x, 2. + p.y)) + f(vec2(2. + p.x, p.y));
    float c = max(0., dot(vec3(n), vec3(0, .6, .3)));
    gl_FragColor = vec4(pow(c, 6.), pow(c,2.), pow(c*n , 2.), 1);
}