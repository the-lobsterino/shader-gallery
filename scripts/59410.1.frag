#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
    float Size = 16.0;
    vec2 Pos = floor(gl_FragCoord.xy / Size);
    float col = mod(Pos.x + Pos.y, 2.0); 
    vec3 col1 = 0.5 + 0.5*cos(time+Pos.xyx+vec3(0,2,4));
    gl_FragColor = col * vec4(vec3(1.0)*col1, 1.0);
}

