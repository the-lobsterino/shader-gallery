precision lowp float;uniform float time;uniform vec2 resolution;
#define __ vec2 _;float w=time;vec2 z=resolution;_=gl_FragCoord.rg/z.rg*vec2(20.,2.);float y=fract(sin(_.r+w)+fract(_.y));gl_FragColor=vec4(0.,y*.4,.9,1.);
void main(){__}//_3 lines by speedhead of byterapers\\