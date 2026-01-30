#ifdef GL_ES
precision mediump float;

#endif
uniform float u_time;
uniform vec2 u_resolution;
#define PI 3.141592653589
#define PI2 2.*PI

vec3 hsl2rgb(in vec3 c)
{
    vec3 rgb = clamp(abs(mod(c.x*6.0+vec3(0.0,4.0,2.0),
                             6.0)-3.0)-1.0,0.,1.);

    rgb = rgb*(3.-2.*rgb);

    return c.z*mix(vec3(1.),rgb,c.y);
}

void main()
{
    vec2 st = gl_FragCoord.xy/u_resolution;
    vec2 ds =vec2(0.5)-st;

    float theta = atan(ds.x,ds.y);
    theta = theta/PI-0.622222222222222222;
    float radius = length(ds)*4.0;

    vec3 color = hsl2rgb(vec3(theta*5000.*abs(sin(u_time))-u_time/1.7,radius,1.));

    gl_FragColor = vec4(color,1.);

}