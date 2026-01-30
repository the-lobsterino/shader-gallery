#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse; 
uniform vec2 resolution;

void main( void ) {

    vec2 position = ( gl_FragCoord.xy / resolution.xy ) + mouse / 4.0;

                   // x1  y1   x2   y2
    vec4 rect = vec4(0.2, 0.3, 0.4, 0.5);
    vec2 hv = step(rect.xy, position) * step(position, rect.zw);
    float onOff = hv.x * hv.y;

    gl_FragColor = mix(vec4(0,0,0,0), vec4(1,0,0,0), onOff);
}