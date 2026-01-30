#extension GL_OES_standard_derivatives : enable

precision highp float;


uniform float time;
uniform vec2 resolution;
uniform vec2 mouse;
uniform vec3 spectrum;


vec3 palette( in float t )
{

vec3 a = vec3(0.000 ,0.500 ,0.500);
 vec3 b=vec3(1.098, 0.500 ,0.500);
 vec3 c=vec3(0.000 ,0.500, 0.333);
 vec3 d=vec3(0.000 ,0.500 ,0.667);

    return a + b*cos( 6.28318*(c*t+d) );
}

#define PI 3.14

void main(void)
{

vec2 uv = (gl_FragCoord.xy*2.  -vec2(resolution))/vec2(resolution.y);
vec2 uv0=uv;
vec3 finalColor = vec3(0);


for (float i = 0.; i<6.; i++){
uv*=1.2;
uv= fract(uv); 
uv-=0.5;



float d = length(uv)*exp(-length(uv0));

     

vec3 col = palette(length(uv0)+time*.4*i*spectrum.y);
 d= cos(d*8.+time*2.)/(8.);
float d2= cos(d*8.+time*2.)/(8.)+length(uv0)-0.8*(0.8+spectrum.x*2.);
d=(d2-d);
d+= fract(length(uv)*2.);
d= abs(d);

d= pow(0.0051/d,1.2);

finalColor+=col*d; 
}
gl_FragColor  = vec4(finalColor,1);


}