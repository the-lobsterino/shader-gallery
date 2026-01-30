#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable


//3.4
//Multiplicación y suma de colores :
//colores
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define PI 3.14159265359
void main(void){


    vec2 uv = gl_FragCoord.xy / resolution; // De esta manera obtenemos las coordenadas cartesianas
      
     //ES IMPORTANTE COMPRENDER QUE NO EXISTE UNA REAL DIFERENCIA ENTRE FORMA Y COLOR EN GLSL
     //LA DIFERENCIA ENTRE UNA Y OTRA ES ARBITRARIA SEGUN LO QUE EL PROGRAMADORE ENTIENDA COMO TAL.
      
     //Esta es la forma que habíamos hecho en el tutorial anterior.
     //Veremos las opciones existentes que hay para poder pintar un dibujo:
     float formafinal = sin(uv.x*10.*PI+time
                            +sin(uv.y*2.*PI+time
                            +sin(uv.x*10.*PI-time 
                            +sin(uv.y*10.*PI-time
                            +sin(uv.x*10.*PI-time
                            +sin(uv.y*10.*PI-time)
                            +sin(uv.x*10.*PI-time))))))*0.5+0.5;
    
    float formafinal2 = sin(uv.y*10.*PI+time
                            +sin(uv.y*10.*PI+time
                            +sin(uv.x*8.*PI-time 
                            +sin(uv.y*5.*PI-time
                            +sin(uv.x*10.*PI-time
                            +sin(uv.y*2.*PI-time)
                            +sin(uv.x*9.*PI-time))))))*0.5+0.5;
                            
                            
    
   
    vec3 color1 = vec3(1.0,0.0,0.2) ; 
    vec3 color2 = vec3(0.2,0.5,1.0) ; 
    
    
    //Creo una variable en donde voy a hacer todas las cuentas finales. 
    //En donde una forma si la multiplico por ese color va a ser de ese color.
    //Sumo 2 formas que fueron multiplicadas por los colores respectivos.
    
    
    vec3 fin = color1 * formafinal + color2 * formafinal2;
    gl_FragColor = vec4(fin,1.0); 
    
    
    
    
    
    
}