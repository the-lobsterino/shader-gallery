/*
 * Original shader from: https://www.shadertoy.com/view/DdyXz3
 */

#ifdef GL_ES
precision highp float;
#endif

uniform float time;
uniform vec2 resolution;



vec2 triangle_wave(vec2 a){
    return abs(fract((a+vec2(1.,0.5))*(1.5))-.5);
}


void main(void)
{
    float t1 = 12.*2.*8.;
    vec2 uv = (gl_FragCoord.xy)/resolution.y/t1/2.0;
    vec3 col,col1 = vec3(0);
    vec2 t2 = vec2(0);
    float c1 = 0.;
    uv += time/t1/32.;
    float scale = 1.5;
    for(int k = 0; k < 16; k++){
        uv = (uv+t2)/scale;
        t2 = triangle_wave(uv-.5);
        uv = (t2-triangle_wave(uv.yx));
        c1 = max(abs(uv.y-uv.x)/2.,c1);
        c1 = max(abs(2.*c1-1.),c1/4.);
        col.x = max(max(length(uv-t2-c1),abs(uv.y-uv.x))/3.,col.x);
        col =  abs(col-(1.-(c1*col.x)));
        col1 = abs(col1*c1-col-1.).yzx;
    }
    gl_FragColor = vec4(col1/2.,1.0);
	
}