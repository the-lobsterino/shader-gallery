#define speEED     			3.6667
#define NUM_EXPLOSIONS			2.
#define NUM_PARTICLES			64.
#define inv_nparticels			(4./NUM_PARTICLES)
precision highp float;
uniform float time;
uniform vec2 mouse, resolution;
uniform sampler2D bb; // backbuffer
#define time ( speEED*time + 8. )
#define PI 3.1415926
#define PI 3.1415926

float Hash11(float t){
    return fract(cos(t*63.2451)*614.845);
}
vec2 Hash12(float t){
  return vec2(fract(8.44*(t*23.345)-314.181)-0.658,fract(sin(t*51.145531)*647.2451)-0.5);
}

vec2 Hash12_Polar(float t){
    float o = fract(sin(t*213.3)*314.8)*PI*2.0;
    float r = fract(sin(t*591.1)*647.2);
    return vec2(sin(o)*r,cos(o)*r);
}

float Explosion(vec2 uv, float t)
{
    float fract_t=fract(t);
    float floor_t=floor(t);
    float power=0.3+Hash11(floor_t);
    float sparks=0.;
    for(float i=0.;i<NUM_PARTICLES;i++)
    {
        vec2 dir=Hash12_Polar(i*1./floor_t)*1.;// yes
        float inv_d=1./(length(uv-dir*sqrt(fract_t)));
        float brightness=mix(0.1333,0.667*fract(dir.x*dir.y),smoothstep(0.,0.1,fract_t))*(1.0-(0.5+0.5*Hash11(i))*fract_t);
        float sparkling= .5+.5*sin(t*10.2+floor_t*i);
        sparks+=power*brightness*sparkling*inv_nparticels*inv_d;
    }
    return sparks;
}

void main()
{
    vec2 uv = (gl_FragCoord.xy-.5*resolution.xy)/resolution.y;
    vec2 uv0 = gl_FragCoord.xy/resolution.xy;
    vec3 col=vec3(0);    

    for(float i=0.;i<NUM_EXPLOSIONS;i++){
        float t=time*(0.3+0.4*Hash11(i))+i/NUM_EXPLOSIONS;
        float fract_t=fract(t);
        float floor_t=floor(t);
        vec3 color=.7+0.3*sin(vec3(.34,.54,.43)*floor_t*i);
        vec2 center = Hash12(i+10.+5.*floor_t);
        col+=Explosion(uv-center,t)*color;
    }
    
    col -= .1; col*=col/3.;
    #define c gl_FragColor.xyz
    gl_FragColor.a = 1.;
    c = col*5.;
    c = ( 1.2/1. )*texture2D( bb, uv0 ).x + ( (1. - .875)/1. )*c;
    c = vec3( 1. - exp2( -c ) );//ändrom3da4twist happy new year boys and girls
} 