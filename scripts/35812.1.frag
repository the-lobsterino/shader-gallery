/*
"Tamby's Star Test" by Emmanuel Keller aka Tambako - December 2015
License Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.
Contact: tamby@tambako.ch
Gigatron touch // chrome fixed if division/0
*/


#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

 
 

const float pi = 3.14159;
const float bs = 0.001;
const float bw = 0.006;

vec2 rotateVec(vec2 vect, float angle)
{
    float xr = vect.x*cos(angle) + vect.y*sin(angle);
    float yr = vect.x*sin(angle) - vect.y*cos(angle);
    return vec2(xr, yr);
}

float star(vec2 uv, vec2 center, float r1, float sf, float nb, float rs)
{
	uv-= center + vec2(0., 0.5*(0.6 - (resolution.x-resolution.y)/resolution.x)); 
    float alpha1 = mod(atan(uv.x, uv.y) + time*rs, 2.*pi/nb);
    float alpha2 = mod(2.*pi/nb-atan(uv.x, uv.y) - time*rs, 2.*pi/nb);
    float alpha = alpha1<pi/nb?alpha2:alpha1;
    float f = sf*length(uv)*cos(alpha)/cos(pi/nb) - length(uv)*(sf-1.);
   float v = smoothstep(r1 - bs, r1 + bs, f) + 0.5 - 0.5*smoothstep(r1 - 2.*bs - bw, r1 + bs - bw, f) + 0.2*pow(smoothstep(r1*0.9, r1*0.2, f), 0.2);

    return v;
}

void main()
{  
    vec2 uv = gl_FragCoord.xy / resolution.xy;
    
    uv.y  =uv.y*0.85;
    
     float v = star(uv, vec2(0.50, 0.4), 0.05, 1.0, 5., 0.2);
    
     float zz=0.0;
    float t=time/5.;
    
    for(int i=1;i<4;i++){
    
         zz +=0.5;
       
    for(float ii=0.0;ii<6.2;ii+=0.2){
          
       
        v *= star(uv, vec2(0.5+(0.5*sin(ii*t)/2.)*zz, 0.40+(1.6*cos(ii*t)/4.)), 0.02, 1.0, 5., 2.0);
  		
         
       
    }
   
     
    }
     
    
   gl_FragColor.xyz = mix( vec3(v), vec3(0.1+uv.y,0.+uv.x,1.0),   v);

}