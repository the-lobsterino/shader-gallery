#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
float t = time*0.50;
void sub_basic_scroller_x(){
vec2 p = ( gl_FragCoord.xy / resolution.xy );
//p.x+=t*0.5;
float color =-0.5; color += sin(p.x * (1.0 ) * 40.0 ) + cos( p.x * ( .001 * .20 ) * 40.0 );
gl_FragColor+=vec4(0.,0.,color*p.y*0.25, 1. );
}
void sub_basic_scroller_x2(){
vec2 p2 = ( gl_FragCoord.xy / resolution.xy )*2.;
p2.x+=-(mod(2.,6.));
float color =.5; color += .1*sin(p2.x * (2.0 ) * 4.0 ) +cos ( p2.y * ( 1. * .50 ) * 40.0 );
if(p2.x<1.5 && p2.y>0.25 && p2.y<.5)gl_FragColor+=vec4(0.02,0.,color,1.);
}
void main(){
sub_basic_scroller_x();
sub_basic_scroller_x2();
}