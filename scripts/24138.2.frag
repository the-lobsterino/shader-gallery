precision mediump float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;

#define N 4
#define PI 3.14159265358979

float alpha_d(float d, float threshold)
{
    if(d < 0.0 || d-threshold < 0.0) return 0.0;
    return d-threshold;
}

void main( void ) 
{
    float size = 0.01;
    float dist = 0.1;
    float ang = time*15.0;
    float d;
    float threshold = 0.5;
    vec2 pos = vec2(0.0,0.0);
    vec4 color = vec4(1.0, 1.0, 1.0, 1.0);
    float r = 0.1;//cos(time*15.0)*0.1;
    for(int i=0; i<N; i++)
    {
        ang += PI / (float(N)/7.);
        pos = vec2(sin(ang + float(N))*r,cos(ang + float(N))*r);
        d = distance(pos*1.0,vec2(surfacePosition.x,surfacePosition.y-0.02));
        dist += size / d;
        vec4 c = vec4(0.98,0.611,0.011, dist);
        color = c*dist;
    }
    gl_FragColor = color*vec4(alpha_d(dist, threshold));
}