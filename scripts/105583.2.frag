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
    float t1 = 240.;
    vec2 uv = (gl_FragCoord.xy)/resolution.y/t1/2.0;
    vec3 col,col1 = vec3(0);
    vec2 t2 = vec2(0);
    float c1 = 0.;
    uv += time/t1/32.;
    float scale = 1.5;
vec2 a=triangle_wave(uv.yx*0.001);	
    for(int k = 0; k < 40; k++){
    a=triangle_wave(a);
    }
	
	
	
	
  
    gl_FragColor = vec4(a,1.,1.0);
	
}