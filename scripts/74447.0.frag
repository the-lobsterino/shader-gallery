#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

//2.4
//OSCILADORES
//Mezclando ondas 
//Taller de Livecoding con visuales en GLSL 



uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


//COMO EL NUMERO PI NO VIENE INCLUDO EN GLSL LO DEFINIMOS MANUALMENTE.
//Utilizamos la estructura #define para definir constantes en el programa.
#define PI 3.14159265359

void main(void)
{   

    vec2 uv = gl_FragCoord.xy / resolution; //Obtengo las coordenadas UV(coordenadas cartesianas.

    float forma  =  sin(time+uv.x*10.*PI)*0.5+0.5; //Degrade constante en X
    float forma2 = cos(time+uv.y*5.*PI)*0.5+0.5;
    
    //Existen varias maneras de mezclar las ondas senoidales. 
    
    //EJEMPLO 1 : 
    //suma de 2 ondas : 
    //float formafinal  = forma + forma2 ; 
    
    
    //EJEMPLO 2 : 
    //Multiplicacion de 2 ondas: 
    //float formafinal  = forma * forma2 ; 
    
    //EJEMPLO 3 : 
    //Mezclarlas dentro de una tercera onda senoidal.
    float formafinal  = sin(forma * forma2 * 10.+time) ; 
    
    
    gl_FragColor = vec4(vec3(formafinal),0.5); 

}