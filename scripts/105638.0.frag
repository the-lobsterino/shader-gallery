
#ifdef GL_ES
precision lowp float;
#endif

uniform float time;
uniform vec2 resolution;
uniform vec2 mouse;
uniform vec3 spectrum;

uniform sampler2D texture0;
uniform sampler2D texture1;
uniform sampler2D texture2;
uniform sampler2D texture3;
uniform sampler2D prevFrame;
uniform sampler2D prevPass;


float Hash( vec2 p)
{
    vec3 p2 = vec3(p.xy,1.0);
    return fract(sin(dot(p2,vec3(37.1,61.7, 12.4)))*758.5453123);
}
float noise(in vec2 p)
{
    vec2 i = floor(p);
    vec2 f = fract(p);
    f *= f * (3.0-2.0*f);


    return mix(mix(Hash(i + vec2(0.,0.)), Hash(i + vec2(1.,0.)),f.x),
               mix(Hash(i + vec2(0.,1.)), Hash(i + vec2(1.,1.)),f.x),
               f.y);
}



void main(void)
{
  
vec2 uv = ( gl_FragCoord.xy / resolution.xy ) * 2.0 - 1.0;
uv.x *= resolution.x/resolution.y;

    
   float  a = noise(cos(uv)-cos(time))*10.;
   a = fract(a+time);
    gl_FragColor  = vec4(a,1., 1.,
        1.0);
}
