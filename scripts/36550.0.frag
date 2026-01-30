#ifdef GL_ES
precision mediump float;
#endif
#extension GL_OES_standard_derivatives : enable
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
float hexGrid(vec2 p){
  p.x *= 1.1547;
  p.y += mod(floor(p.x), 2.)*0.5;
  p = abs((mod(p, 1.0) - 0.5));
  return abs(max(p.x*1.5 + p.y, p.y*2.0)-1.0);
}
void main( void ) {
    vec2 p = ( gl_FragCoord.xy * 2.0 - resolution.xy ) / time /10.0;
    float color = hexGrid(p * 4.0 + vec2(sin(time*10.0), 0.0));
    if(color > 0.1) discard;
    
    gl_FragColor = vec4(1.0 - color);
    
}