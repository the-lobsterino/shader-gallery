#extension GL_OES_standard_derivatives : enable


precision highp float;
uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;
  
uniform sampler2D backBuffer;
void main(){vec2 r=resolution,p=(gl_FragCoord.xy*4.-r.x-r.y)/min(r.x,r.y)
-mouse;
for(int i=0;i<8;++i)
{p.xy=abs(p.yx)/.92-(dot(-p+p.y,p.x-p-sin(mouse)*p))-vec2(.19+cos(time*.2)*.24)/2.5/mouse;}
gl_FragColor=-sin(vec4(p.yxyx/cos(p.yyyx-p.xyyx)))+texture2D(backBuffer,p.xy*.99);}






