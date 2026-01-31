#extension GL_OES_standard_derivatives : enable
// original https://www.shadertoy.com/view/Ntccz2
precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
void main( void )
{
   
    vec2 U =( 2.*gl_FragCoord.xy -resolution.xy)/resolution.y; 

     float b=sqrt(length(U));
  
  float t=time*.5;U=fract(vec2(b-t,abs(atan(U.x,U.y))));
  

  vec2 c=U*mouse*vec2(25.,85.*sin(time*0.10)-22.);

  U=floor(mod((c),vec2(256*2)));

  float d=b*mod((U.x*U.x+U.y*U.y),U.x-U.y)/26.;

  gl_FragColor=vec4(fract(d*U.x),fract(d*U.y),d,1.);
    

}


