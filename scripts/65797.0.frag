#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

//2.3
//OSCILADORES
//Frecuencia y tiempo.
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
    
    vec2 p = vec2(.7) - uv; //Genero un punto en el espacio(en este caso en el medio.
    float r = length(p);  //Obtengo el radio
    float a = atan(p.x,p.y);//obtengo el angulo. 
	
	
    //Si a la función senoidal le sumamos una variable. veremos que oscilara en relación en esa variable. 
    //En este caso si le colocamos uv.x va a ir haciendo un constante degrade : 
    
    
    //Si a la frecuencia la multiplicamos por PI obtendremos exactamente ese numero de "lineas".
    float freq = 20.3*PI; 
    
    //float forma1 = sin(r*20-time)*0.5+0.5; //Degrade constante en X
    //float forma2 = sin(uv.y*PI/time)*0.5+0.5; //Degrade constante en Y
    float forma3 = sin(r*2.-time); //Degrade constante en X+Y
    float forma4 = sin(a*10.+time+sin(r*5.5-time))*2.5+3.5; //Así se ve cuando una oscilación es entre -1 y 1
    
    vec3 color1 = vec3(1.7,0.0,1.0) ; 
    vec3 color2 = vec3(0.0,0.0,1.0) ;
	
    
    vec3 cuentafinal = color1 * forma3 + color2 * forma4;      
    gl_FragColor = vec4(vec3(cuentafinal),2.40); 

}