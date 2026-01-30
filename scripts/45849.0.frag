//original: https://gist.github.com/keijiro/79b2f54e34561b83066b386c3391c273

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform sampler2D backbuffer;
uniform vec2 resolution;


float rand(float x, float y)
{
    return fract(sin(0.2 * x + 78.233 * y) * 43758.5453);
}

void main(void)
{
    vec2 uv = gl_FragCoord.xy / resolution;
    float aspect = resolution.x / resolution.y;
    
    // ellipse
    float r = length((uv - 0.5) * vec2(aspect, 1));
    float c = 1. - step(0.5*rand(floor(time*20.),1.), r);
    
    // displacement
    float t = floor(time * 2.);
    float phi = rand(t, 0.) * 3.14;
    vec2 d = vec2(cos(phi), sin(phi));
    float wd = rand(t, 1.) * 100.;
    float sd = floor(wd * dot(uv, d.yx * vec2(-1, 1)));
    uv += d * 0.02 * (rand(sd, t) - 0.5);

    // feedback
    c += texture2D(backbuffer, uv).b * 0.99;
    
    // color gradient
    float c1 = 0.5 + sin(c * 9.12 + time * 1.11) * 0.5;
    float c2 = 0.5 + sin(c * 7.33 + time * 1.73) * 0.5;
    gl_FragColor = vec4(c1, c2, c, 0);
}