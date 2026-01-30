#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform vec4 

void main( void ) {
 vec2 uv = gl_FragCoord.xy * 2.0 - resolution.xy;
    vec4 o;
    vec2 p ,c;
    float a;
    for(float i = 0.0;i < 400.0;i++){
        a=  i/2e2 - 1.0;
        p = cos(i * 2.4 + cc_time.x + vec2(0,3.14 / 2.0)) * sqrt(1.0 - a*a);
        c = uv / resolution.y + vec2(p.x,a) / (p.y + 2.0);
        o += (cos(i + vec4(0,2,4,0)) + 1.0)/dot(c,c) * (1.0 - p.y) / 3e4;
    }
    gl_FragColor = o.rgba;

}