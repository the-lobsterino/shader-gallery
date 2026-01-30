
//The 90Hz heart made by 834144373zhu/2015
//https://www.shadertoy.com/view/4lfSz7
////////////////////////////////////////
//Today is last of my "First Year College life".
//Come on,let me have a good relax.
precision mediump float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
    vec2 pos = -((gl_FragCoord.xy / resolution.xy)-vec2(0.5,0.45))*vec2(1.12,1.58)*1.3;
    vec3 c;
    c.r += smoothstep(.0,0.5+sin(time)*0.45,.85-length(pos+vec2(pos.x,pow(abs(pos.x),0.9))));
    c.g += smoothstep(.0,0.5+sin(time*1.2)*0.45,.85-length(pos+vec2(pos.x,pow(abs(pos.x),0.9))));
    c.b += smoothstep(.0,0.5+sin(time*0.8)*0.45,.85-length(pos+vec2(pos.x,pow(abs(pos.x),0.9))));
    c.g /= 5.2;
    //c += pow(c.r,1.+.2*fract(time*1.5));
    gl_FragColor = vec4(c,1.0);
}