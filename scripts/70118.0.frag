#ifdef GL_ES
precision mediump float;
#endif
//infinitysnapz 25/12/20
//merry christmas

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 resolution;
const float PI = 3.1415926538;

void main( void ) {
    
    vec2 pos = ( gl_FragCoord.xy / resolution.x ) - vec2(2 , (resolution.y/ resolution.x) *2.0) / 4.0;
    pos = pos + vec2(sin(time*0.48),cos(time*0.3));
    bool bl = (abs(mod(pos.x*15.0,2.0)-1.0)>mod((pos.y*5.0),0.3)+0.35);
    vec4 color;
    if(bl) {color = vec4(0.1,0.6,0.2, 1);} else {color = vec4(0.02,0.3,0.2, 1);};
    float s = (1.0-abs(sin(pos.y*100.0+time*10.0)))/10.0;
    float d = (1.0-abs(cos(pos.x*100.0+sin(time*1.0)*23.0)))/10.0;
    gl_FragColor = color + vec4(mod(s,d*10.0)*4.0,d,s,0);
    }