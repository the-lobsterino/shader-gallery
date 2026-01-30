#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

//3.2
//Colores
//Funciónes HSB y RGB: 

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
#define PI 3.14159265359


//FUNCIONES SACADAS DE https://thebookofshaders.com/06/: 
//esta es para transformar si pensamos un color en hsb a rgb, nunca lo use.
vec3 rgb2hsb( in vec3 c ){
    vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
    vec4 p = mix(vec4(c.bg, K.wz),
                 vec4(c.gb, K.xy),
                 step(c.b, c.g));
    vec4 q = mix(vec4(p.xyw, c.r),
                 vec4(c.r, p.yzx),
                 step(p.x, c.r));
    float d = q.x - min(q.w, q.y);
    float e = 1.0e-10;
    return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)),
                d / (q.x + e),
                q.x);
}

//  Function from Iñigo Quiles
//  https://www.shadertoy.com/view/MsS3Wc
vec3 hsb2rgb( in vec3 c ){
    vec3 rgb = clamp(abs(mod(c.x*6.0+vec3(0.0,4.0,2.0),
                             6.0)-3.0)-1.0,
                     0.0,
                     1.0 );
    rgb = rgb*rgb*(3.0-2.0*rgb);
    return c.z * mix(vec3(1.0), rgb, c.y);
}


//Declaramos el render de salida


void main(void){


    vec2 uv = gl_FragCoord.xy / resolution; // De esta manera obtenemos las coordenadas cartesianas
    
    float forma  =  sin(time+uv.x*10.*PI)*0.5+0.5; //Degrade constante en X
    float forma2 =  sin(time+uv.y*5.*PI)*0.5+0.5;
    
     //Puedo utilizar la función hsb2rgb para expresar los colores en hsb.
     //HSB SIGNIFICA : HUE-SATURATION-BRIGHTNESS (tono,saturacion y brillo).
     //De esta manera el segundo parametro corresponde a la saturación.
     //Y el tercer parametro al brillo
	
     
           vec3 color = hsb2rgb(vec3(sin(uv.x ),0.9 - uv.y,uv.y/3.1));
	 
	        float forma3  = sin(forma * forma2*10.+time) ; 
		
		float formafinal1 = forma3 * color[0];
		float formafinal2 = forma3 * color[1];
		float formafinal3 = forma3 * color[2];

           gl_FragColor = vec4(formafinal1,formafinal2,formafinal3,1.0); 
		
   
}