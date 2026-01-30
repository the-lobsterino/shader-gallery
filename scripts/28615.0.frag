precision mediump float;

uniform float time;

#define mod(x, k) (1. - abs((x) - floor((x) / (k)) * (k) - 1.))

vec4 hsv2rgb(float h, float s, float v)
{
    h *= 6.;
    float c = v * s;
    float x = c * mod(h, 2.);
    float m = v - c;
    vec4  r = vec4(m, m, m, 0);
    if(h < 1.)  return r + vec4(c, x, 0, 1);
    if(h < 2.)  return r + vec4(x, c, 0, 1);
    if(h < 3.)  return r + vec4(0, c, x, 1);
    if(h < 4.)  return r + vec4(0, x, c, 1);
    if(h < 5.)  return r + vec4(x, 0, c, 1);
    return r + vec4(c, 0, x, 1);
}



void main( void ) {
    vec4 pp = gl_FragCoord;
    pp /= 50.;
    float t = (time / 10000.);
    float f = (pow(t, 2.) * (pp.x * pp.x + pp.y * pp.y) - 0.01 * sin(10. * (pp.y + pp.x * time)));
    gl_FragColor = hsv2rgb(mod(f / t, 1.), mod(f / (t * t), 1.), 1.);

}