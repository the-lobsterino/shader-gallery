
// Author: Patricio Gonzalez Vivo


#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

#define PI 3.1415926535
#define HALF_PI 1.57079632679

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


// Title: recoded Fractal Invaders by Jared Tarbell
// http://www.levitated.net/daily/levInvaderFractal.html



float random(in float x){ return fract(sin(x)*43758.5453); }
float random(in vec2 st){ return fract(sin(dot(st.xy ,vec2(12.9898,78.233))) * 43758.5453); }

float randomChar(vec2 outer,vec2 inner){
    float grid = 10.;
    vec2 margin = vec2(.11,.11);
    vec2 borders = step(margin,inner)*step(margin,1.-inner);
    vec2 ipos = floor(inner*grid);
    ipos = abs(ipos-vec2(5.,0.));
    return step(.55, random(outer*24.+ipos)) * borders.x * borders.y;
}

void main(){
    vec2 st = gl_FragCoord.st/resolution.xy;
    float ratio = resolution.x/resolution.y;
    st.x *= ratio;
    vec3 color = vec3(0.0);

    float rows = 5.0;
    rows += floor(mod(time*0.01,24.));
    
    float time = 1.+time*1.35;
    vec2 vel = vec2(0.,-floor(time));
    
    vec2 ipos = floor(st*rows);
    vec2 fpos = fract(st*rows);
    
    float pct = 1.0;
    pct *= randomChar(mod(ipos + vel,vec2(999.)),fpos);
    if (ipos.y > 0.0 || ipos.x < fract(time)*rows*ratio) {
        color = vec3(pct);
    }  

    gl_FragColor = vec4 (0.0,color.x,0.0,1.0);
}