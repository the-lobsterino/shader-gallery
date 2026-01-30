#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable



uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


#define PI 3.14159265359

void main(void)
{   

    vec2 uv = gl_FragCoord.xy / resolution; 

   vec3 color = vec3(tan(time)*0.8+1.5,cos(time*2.)*0.5,3.);     
   //vec3 color2 = vec3(0,0,0.5);  

    float formafinal = sin(uv.x*10.0-time*2.1
                            +fract(uv.x*5.0*PI-time
                            +sin(uv.y*2.0*PI+time 
                            +sin(uv.y*10.0*PI+time
                            +abs(uv.y*10.*PI-time
                            +sin(uv.y*1.0*PI-time)
                            +sin(uv.x*10.0*PI-time))))))*0.6+0.01;
  
  
    
    gl_FragColor = vec4(vec3(formafinal)*vec3(color),2.); 

}