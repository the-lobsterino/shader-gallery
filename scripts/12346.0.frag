#ifdef GL_ES
precision highp float;
#endif
 
uniform vec2 resolution;
uniform float time;
 
void main( void ) {
    vec2 p = ( gl_FragCoord.xy / resolution.xy );
    float a = time;
    vec2 c = vec2(0.5,0.5);
    p.y +=  0.07 * cos((p.x * 50.0) + a);
    p.y += 2.0 * cos(p.x + 20.0 * a) / 200.0;
    float v = 0.6;
    v += 1.0 - abs(p.y - 0.55) * 50.0;
     
    gl_FragColor = vec4(v ,v * 0.3, v * 0.6,1.0);
}