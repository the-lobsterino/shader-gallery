#ifdef GL_ES
precision highp float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

//trip by juhaxgames
void trip(){
vec2 pos = gl_FragCoord.xy /resolution.xy*2.-1.*vec2(1.,1.);
float r = length(pos);float t = atan(pos.y, pos.x);float c;
if (time<=1.) c=1.0/((r*2.0) - (1.0+sin(t))*(1.0+0.9*cos(32.0*t))*(1.0+0.1*cos(2.0*t))*(0.5+0.05*cos(4.0*t)));
if (time>1. && time<=2.) c=1.0/((r*2.0) - (1.0+sin(t*64.))*(1.0+0.9*cos(32.0*t))*(1.0+0.1*cos(2.0*t))*(0.5+0.05*cos(4.0*t)));
if (time>2. && time<=3.) c=1.0/((r*2.0) - (1.0+sin(t*64.))*(1.0+0.9*cos(32.0*t*64.))*(1.0+0.1*cos(2.0*t))*(0.5+0.05*cos(4.0*t)));
if (time>3. && time<=4.) c=1.0/((r*2.0) - (1.0+sin(t*32.))*(1.0+0.9*cos(32.0*t*32.))*(1.0+0.1*cos(2.0*t))*(0.5+0.05*cos(4.0*t)));
if (time>4. && time<=5.) c=1.0/((r*2.0) - (1.0+sin(t*2.))*(1.0+0.9*cos(32.0*t*2.))*(1.0+0.1*cos(2.0*t))*(0.5+0.05*cos(4.0*t)));
if (time>5. && time<=6.) c=1.0/((r*2.0) - (1.0+sin(t*12.))*(1.0+0.9*cos(32.0*t))*(1.0+0.1*cos(2.0*t))*(0.5+0.05*cos(1.0*t)));
if (time>6. && time<=7.) c=1.0/((r*2.0) - (1.0+sin(t*22.))*(1.0+0.9*cos(32.0*t*64.))*(1.0+0.1*cos(2.0*t))*(0.5+0.05*cos(2.0*t)));
if (time>7. && time<=8.) c=1.0/((r*4.0) - (1.0+sin(t*4.))*(1.0+0.5*cos(32.0*t*32.))*(1.0+0.1*cos(2.0*t))*(0.5+0.05*cos(3.0*t)));
if (time>8. && time<=9.) c=1.0/((r*4.0) - (1.0+sin(t*4.))*(1.0+0.5*cos(32.0*t*2.))*(1.0+0.5*cos(2.0*t))*(0.5+0.05*cos(4.0*t)));
if (time>9. ) c=2.-1.0/((r*abs(sin(time*.5))) - (1.0+sin(t*123.))*(1.0+0.5*cos(32.0*t*2.))*(2.0+0.5*cos(2.0*t))*(0.5+0.05*cos(4.0*t)));gl_FragColor = vec4(c*.01,.0,2.0-c, 1.0 );
if(time<9.)gl_FragColor = vec4(0.,1.*.50-c,.0, 1.0 );
}
void main(){trip();}
