#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable



uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


#define PI 3.14159265359
#define TWO_PI PI*2
void main(void)
{
 
    vec2 uv = gl_FragCoord.xy / resolution;
    float fix = resolution.x/resolution.y;
    uv.x*=fix;
    
    //Los fors son una estructura repetitiva tienen 3 elementos
    
    //-El valor inicial : int i = 0; 
    //-El limite : i<cantidad; 
    //-El aumento : i++
    
    //El valor inicial nos permite indicar que valor tendra i 
    //la primera vez que recorre el bucle.
    
    //El limite nos indica la condicion por la cual se mantendra dentro del bucle
    //En este caso mientras que i sea menor que cantidad. 
    //El aumento nos indica cuanto aumenta i en cada frame.
    
	
    //Es necesario definir las variables int como CONST de elementos de un array.
	
    const int cantidad = 20;//Defino la cantidad de iteraciones que tendra mi for
    float amp = 0.29; //Variable para manejar la amplitud de los circulos.
    vec3 fin = vec3(0.0);//Defino un vec3 en el que ire sumando los circulos.
    
    
    for(int i =0; i< cantidad; i++){
            
            
	    
	float f_i = float(i);
	
	float f_cnt = float(cantidad);
	    
        float index = f_i*PI*2.0/float(cantidad); 
        
        
        vec2 pos = vec2(0.5*fix,0.5);//Defino una posicion 
        
        //genero un vector de movimiento para generar movimiento circular
        //y le agrego el index para que todos se muevan en fase
        
	    
	vec2 mov = vec2(cos(time/1.5+index/.2)*amp,cos(time+index*1.5)*amp);
        pos+=mov; // sumo el movimiento a la posicion.
        
        vec2 p = pos - uv; // defino un punto.
        float r = length(p); //obtengo el radio
	    
	    
	vec3 col1 = vec3 (0.0,0.1,0.);
	vec3 col2 = vec3 (0.9,0.1,0.9);    
        vec3 colf = mix(col1*2.,col2/2.,(float(i)+1.)/float(cantidad)*sin(time/.15));
        
        fin+= smoothstep(0.98,0.99,1.-r+colf)/colf; //Sumo el dibujo del circulo a mi vector final y los colores
        
        //Cada vez que termina de correr el bucle una vez, 
        //lo vuelve a correr y la variable i aumenta en uno (i++)    
    }
	vec3 colf1 = vec3(0.5,0.3,0.6);
	vec3 colf2 = vec3(0.1,0.7,0.2);
	vec3 colf3 = vec3(0.3,0.2,0.9);
	vec3 colfinf= mix(colf1,colf2,colf3);
	
	
    gl_FragColor = vec4(fin,1.0); 
}
