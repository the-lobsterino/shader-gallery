#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define PI 3.1415926535897932384626433832795
#define TWO_PI 6.283185307179586476925286766559

void main() {
    vec2 st = gl_FragCoord.xy/resolution.x;     
    //0.02 - 0.4

    
    float stp = smoothstep(0.0, 1.0, mod(time / 20.0 , 2.0));
    float dis = (1.0 - stp) * 0.38 + 0.009;
    

   //if (dis < 0.01) dis = 0.01;

    
    float currentDegree = TWO_PI * mod(time/4.0, 1.0);
    float x = cos(currentDegree) * dis;
    float y = sin(currentDegree) * dis;
    
    //0.7 - 20.0
    stp = smoothstep(0.0, 1.0, mod(time / 40.0 , 1.0));
    float lght = stp * 20.3 + 0.7;
    float pct = pow(distance(st,vec2(0.4)), distance(st,vec2(x + 0.4, y + 0.4))*lght);

    
    vec3 color = vec3(pct);
    float m = smoothstep(0.0, 0.01, stp);
	color = vec3(mix(1.0, pct, m));
    gl_FragColor = vec4(color,1.0);
}