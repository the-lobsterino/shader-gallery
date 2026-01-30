precision mediump float;

uniform vec2  resolution;
uniform float time;

float PI = 3.1415926535;

void main( void ) {
    vec2 p=(gl_FragCoord.xy -.5 * resolution)/ min(800.0,600.0);
    vec3 c = vec3(0);
   
    for(int i = 0; i < 100; i++){
    float t = 2.* PI * float(i) / 20. * fract(0.01);
    float x = cos(t) * sin(t);
    float y = sin(-t);
    vec2 o = 0.45 * vec2(x,y);
    float r = fract(t);
    float g = 1.-r;
    float b = 1.-r;
    c += 0.005/(length(p-o))*vec3(r,g,1);
    }
    gl_FragColor = vec4(c,1);
}