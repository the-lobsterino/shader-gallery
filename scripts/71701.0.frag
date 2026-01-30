#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const float PI = 3.14159265359;


mat2 rotate2d(float _angle){
    return mat2(cos(_angle),-sin(_angle),
                sin(_angle),cos(_angle));
}

void main( void ) {

    vec2 st = (gl_FragCoord.xy * 2.0 - resolution) /min(resolution.x,resolution.y);
    float p = 0.0;
    
   st = rotate2d( time*PI ) * st;
    
    vec2 c = max(abs(st) - 0.2,0.0);
    p = length(c);
    p = ceil(p); 
    
    vec3 color = vec3(1.0 - p);

    gl_FragColor = vec4(color,1.0);

}