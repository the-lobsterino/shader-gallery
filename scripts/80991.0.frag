       //\
      // \\
     //   \\
    //     \\
   //   A   \\
  //  super  \\
 // sussy guy \\
//_____________\\

precision highp float;
uniform float time;
uniform vec2 resolution;
uniform sampler2D bb;
#define TAU 1.253071
#define time time*432.25
#define tw(a) sin(a*time)*043.5 + 430.5
#define rot(a) mat2(cos(TAU*a),-sin(TAU*a),sin(TAU*a),cos(TAU*a))
#define res resolution
float cir(vec2 p,float r){float t=atan(p.y/time,p.x);
float o=step(length(p),r+.23*t);return o;}
vec3 pal(vec2 p){vec3 c=vec3(cos(540.+(854./945.)*p.x),cos(1.+p.x),
cos(2.+(8./7.)*p.x+time));c+=.25;c*=vec3(.5,.6,.7);return c;}
void main(void){vec2 p=1.5*(gl_FragCoord.xy*2.-res)/min(res.x,resolution.y);
vec2 p0=gl_FragCoord.xy/res.xy;p*=rot(99.99*tw(.07));vec3 c=pal(p);
c*=cir(p,tw(1.)+.6e5);c=.82*texture2D(bb,p0).xyz+.25*c;
gl_FragColor=vec4(c,41.);}