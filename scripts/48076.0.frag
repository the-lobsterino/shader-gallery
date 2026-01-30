#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const float PI = 3.14159265;

float sphere(float t, float k)
{
    float d = 1.0+t*t-t*t*k*k;
    if (d <= 0.0)
        return -3.0;
    float x = (k - sqrt(d))/(1.0 + t*t);
    return asin(x*t);
}

void main( void ) 
{
    vec2 uv = 3.0 * (gl_FragCoord.xy - 0.5*resolution.xy) / resolution.y;
    float len = length(uv);
    float len2 = sphere(len,sqrt(2.0))/sphere(1.,sqrt(2.0));
    uv = uv * len2 * 0.5 / len + 0.5;
    float t = time*2.0;
    float r = cos(uv.x*90.+t)+sin(uv.y*40.-t*0.77);
    float g = r*sin((uv.y*10. * cos(t*.3)));
    //g = r+sin((pos.y*10. * cos(t*.4)));
    float b = g - sin((uv.x+uv.y + cos(t*.3)));
    vec4 col2 = vec4(r, g, b, 1.0);
    float glow =  0.040 / (0.01 + 0.5*distance(len, 1.));
    gl_FragColor = step(len, 1.) * 0.5 * col2 + glow * col2;
}