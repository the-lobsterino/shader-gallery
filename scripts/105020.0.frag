#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float iTime = time;
vec2 iResolution = resolution;

float k(float a){return fract(iTime*a)*3.141593*4.;}mat2 e(float a){float b=sin(a),c=cos(a);return mat2(c,b,-b,c);}float l(float a,float b,float c){float d=clamp(.5+.5*(b-a)/c,0.,1.);return mix(b,a,d)-c*d*(1.-d);}float m(float a){return radians(a);}float n(vec3 c){vec2 a=c.xy;a*=e(k(.05)),a.x+=cos(c.z)*.3,a.y+=sin(c.z)*.3;float b=abs(a.x)-.05;b=min(-b,-(abs(a.y)-.05)),b*=-1.,a*=1.5;float d=abs(a.x)-.05;d=min(-d,-(abs(a.y)-.05)),d*=-1.,b=max(b,-d);return max(b,abs(c.z)-2.5);}float o(float a){float b=a-floor(a);b=b>.5?1.:0.;return floor(a)+b;}float p(vec3 a){float c=5.;a.yz*=e(.15708),a.z=a.z-5.*clamp(o(a.z/5.),-1.,1.);for(float b=0.;b<50.;b++){if(b>9.)break;vec3 d=a;d.xy*=e(m(36.*b)+1.570796),c=l(c,n(d),.12);}return c;}vec3 q(vec3 r,vec3 s){float c=0.,d=0.,i=0.,f=0.,g=0.,b=.1;b=1.-b,f=sqrt(1e-3)*(1.-b);vec3 h=vec3(0),a=vec3(0);for(int j=0;j<64;j++){h=r+s*c,d=p(h),g=1.-d/f;if(g>0.)a+=.1*g/c,a+=sin(iTime+h+vec3(0,2,4))*.05,a*=5.,i++;if(i>2.)break;c+=max(d*.777778,f*b*.1);}a=clamp(a,0.,1.);return a;}


void main(){
  vec2 a = gl_FragCoord.xy / iResolution.xy;
  a = (a - .5) * 2., a.x *= iResolution.x / -iResolution.y; //
  vec3 b = vec3(0), c = vec3(0, 0, -.5), d = vec3(a, 1);
  b = q(c, d);
  gl_FragColor = vec4(b, 1);
}