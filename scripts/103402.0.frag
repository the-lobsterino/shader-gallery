// Assumptions: 
// iResolution is a vec2, representing screen resolution.
// iTime is a float, representing time.
uniform vec2 iResolution;
uniform float iTime;

void mainImage(out vec4 fragColor, in vec2 fragCoord)
{
    vec2 uv = fragCoord / iResolution.xy;

    float i = 0.0;
    for(float len = 0.0; len < 100.0; len += 0.5)
    {
        float val = .001 / abs(length(uv+sin(iTime*.5+i)*vec2(cos(i+iTime),sin(i))) - sin(i*2.+iTime)*.015-.005);
        fragColor += val * (1. + cos(i*8. + iTime + length(uv)*8.));
        uv *= mat2(cos(1.5), sin(1.5), -sin(1.5), cos(1.5));
    }
}}