/*
  Daily an hour GLSL sketch by @chimanaco 3/30

  References:
  http://tokyodemofest.jp/2014/7lines/index.html
*/

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2  resolution;
uniform float time;
uniform vec2 mouse;

float PI = 3.1415926535;

void main( void ) {
    vec2 p=(gl_FragCoord.xy -.5 * resolution)/ min(resolution.x,resolution.y);
    vec3 c = vec3(0);
   
    for(int i = 0; i < 50; i++){
    float t = 2.* PI * float(i) / 10. * fract(time*0.05);
    float x = cos(t) * sin(t);
    float y = cos(t)* t/PI*fract(t)*x;
    vec2 o = 1.45 * vec2(x,y);
    float r = fract(t);
    float g = 1.-r;
    float b = 1.-r;
    c += .007/(length(p-o))*vec3(r,g,2);
    }
    gl_FragColor = vec4(c,1);
}