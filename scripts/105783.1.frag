#define __ precision mediump float;uniform float time;uniform vec2 resolution;void main(){vec2 _;float w=time;vec2 z=resolution;_=gl_FragCoord.rg/z.rg*vec2(2.,2.);float y=fract(sin(_.r+w)+fract(_.y));gl_FragColor=vec4(0.,y*.3,.5,.9);}
   //\    ______    o__     . __o
__//_\\__|__||__|   |     ||    |
 //___\\    ||      /\    ||   /\
//     \\__ || __P TENNIS (1Line by speedhead spatiosa)	