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
        return -1.0;
    float x = (k - sqrt(d))/(1.0 + t*t);
    return asin(x*t);
}


void main( void ) 
{
    // bg texture
    vec4 texColor = vec4(0.1,0.,0.3,0.5);
    
    vec2 uv = gl_FragCoord.xy - 0.5*resolution.xy;
    float v = resolution.x;
    if (v > resolution.y)
        v = resolution.y;
	uv /= v;
    uv *= 3.0;
    float len = length(uv);
    float k = 1.0;
    float len2;

    len2 = sphere(len*k,sqrt(2.0))/sphere(1.*k,sqrt(2.0));
	uv = uv * len2 * 0.5 / len;
	uv = uv + 0.1;
	
    vec2 pos = uv;
    float t = time/1.0;
    float r, g, b;
    
    //val += sin((pos.x*scale1 + t*2.))*3.;
    r = cos(pos.x*90.+t)+sin(pos.y*40.-t*0.77);
    g = r+sin((pos.y*10. * cos(t*.4)));
    //g = r*sin((pos.y*10. * cos(t*.3)));
    b = g-sin((pos.x+pos.y + cos(t*.3)));

    float glow =  1.40 / (0.01 + 0.5*distance(len, 1.));
    
    //val = (cos(PI*val) + 1.0) * 0.5;
    vec4 col2 = vec4(r, g, b, 0.1);
    
    gl_FragColor = step(len, 1.) * 0.1 * col2 + glow * col2 ;
}