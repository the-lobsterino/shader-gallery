#extension GL_OES_standard_derivatives : enable
//stfg

precision mediump float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


float sm(float v1, float v2, float v3){
    return smoothstep(v1,v2,v3);
}

void main(void)
{
    vec2 uv = gl_FragCoord.xy /resolution.xy;
     float fix = resolution.x/resolution.y;
        uv.x *= fix;
    
    
    vec2 mov = vec2(sin(time)*.2,cos(time*0.6)*0.1*cos(time));
    
    
    vec2 pos = vec2(0.5*fix,0.5) - uv  +mov; // no deveria ser a la inversa
    float a = atan(pos.x,pos.y);
    float r = length(pos);
    

float size =0.1;
float dif = 0.0;
float deformar = 0.0; 


deformar = sin(r*150.*sin(r*100.+sin((uv.x+uv.y)*200.))*cos(uv.x*5.))*0.1; 

deformar = sin(uv.y*200.*sin(uv.x*50.+cos(time*0.5)*0.25))*0.5;
deformar = sin(uv.y*200.*sin(uv.x*500.))*0.5;   // este me encanta

    float e = 1.0 - sm(size,size+dif,r+deformar);

    vec3 fin = vec3(e);
    gl_FragColor = vec4(fin,1.0);
}