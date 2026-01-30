#ifdef GL_ES
precision mediump float;
#endif

//Taller de Livecoding con visuales en GLSL
//1.2
//Estructura del lenguaje inicial parte 2 
//Intro a creacion de variables.



//Variables uniform para manejar la interfaz

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


//Declaramos el render de salida
//out vec4 fragColor; 
void main(void)
{
    
    //También podemos definir nuestras propias variables para colocar          //dentro del vec4 final.
    
    //Ejemplo 1 : 
    //descomentar codigo : 
    float red = 0.9;   //Cantidad de rojo 
    float green = 0.3; //Cantidad de verde.
    float blue = 0.3;  //Cantidad de azul.  
   // gl_FragColor = vec4(red,green,blue,1.0); 
    
    //Ejemplo 2 : 
    //Tambien podemos definir una variable vec3 y luego meterla dentro del vec4 obligatorio final : 
    //usemos float , vec2 , vec3 o vec4 las variables son siempre intercambiables.
    vec3 color = vec3(0.2,0.5,0.4); 
    //gl_FragColor = vec4(color,1.0); 
    
    
    //Ejemplo 3 : 
    //También podemos obtener un valor especifico de un vector utilizando el nombre del vector + .r
    //color.r; obtiene el primer valor del vector.
   //color.g; obtiene el segundo valor del vector.
    //color.b; obtiene el tercer valor del vector.
   // color.a; obtiene el cuarto valor del vector.
    
    //EN ESTE CASO ESTAMOS colocando en el valor R del fragcolor, el valor G de color 2. 
    //De esta manera nosotros podemos decidir que valores entran en que lugar.
   // gl_FragColor = vec4(color.g,color.b,color.b,1.0); 
    
    //Ejemplo 4 : 
    //Otra manera de obtener los valores individuales de los vectores es utilizando xyzw en vez de rgba
    //Se suele utilizar xyz cuando nuestros vectores representan puntos en el espacio y no valores de colores.
    gl_FragColor = vec4(color.y,color.x,color.y,1.0); 
    
    //Ejemplo 5 : 
    //Otra manera de obtener los valores individuales de los vectores es utilizando los vectores como si 
    //estuvieramos pasandole el indice al array.
   // gl_FragColor = vec4(color[2],color[0],color[2],1.0); 
    
    
    
}
