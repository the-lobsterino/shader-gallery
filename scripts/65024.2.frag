#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

//8.2
//Feedback
//feedback mix


uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


//AGREGO EL UNIFORM DEL BACKBUFFER. ACA EN GLSLSANDBOX ES BACKBUFFER. EN OTRAS PLATAFORMAS SERA OTRO.
uniform sampler2D backbuffer;
#define PI 3.14159265359
#define TWO_PI PI*2

//DECLARO UNA FUNCION. ESTA FUNCION ME SIRVE PARA GENERAR POLIGONOS.
//Funcion sacada de : https://thebookofshaders.com/07/
//aunque la transformación a función fue hecha por jp.
float poly(vec2 uv,vec2 p, float s, float dif,int N,float a){
    // Remap the space to -1. to 1.
    vec2 st = p - uv ;
    // Angle and radius from the current pixel
    float a2 = atan(st.x,st.y)+a;
    float r = PI*2.0/float(N);
    float d = cos(floor(.5+a2/r)*r-a2)*length(st);
    float e = 1.0 - smoothstep(s,s+dif,d);
    return e;
}
mat2 scale(vec2 _scale){
    return mat2(_scale.x,0.0,
                0.0,_scale.y);
}
mat2 rotate2d(float _angle){
    return mat2(cos(_angle),-sin(_angle),
                sin(_angle),cos(_angle));
}



//HAGO FUNCIONES PARA ESCALAR UVS EN UNA SOLA LINEA !!
vec2 scale(vec2 uv,vec2 _sc){
    float fix = resolution.x/resolution.y; 
    uv-=vec2(0.5*fix,0.5);
    uv = scale(_sc)*uv;
    uv+=vec2(0.5*fix,0.5);
    return uv;
}
//HAGO FUNCIONES PARA ROTAR UVS EN UNA SOLA LINEA !!
vec2 rotate2d(vec2 uv,float _rot){
    float fix = resolution.x/resolution.y; 
    uv-=vec2(0.5*fix,0.5);
    uv = rotate2d(_rot)*uv;
    uv+=vec2(0.5*fix,0.5);
    return uv;
}
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

void main(void){
    vec2 uv = gl_FragCoord.xy / resolution;
    
	
    float fix = resolution.x/resolution.y;
    
    //Definimos unas UV con el aspect radio arreglado que solo vamos a usar en la forma NO EN EL FEEDBACK
    vec2 uv_forma = uv;
    uv_forma.x*=fix;
	
	
    //La función texture recibe como parametro el sampler2D y las coordenadas uv. 
    vec4 feedback = texture2D(backbuffer,uv);
    
    //Hago un vector para manejar el movimiento : 
    vec2 mov = vec2(sin(time*0.5)*0.5,cos(time*4.)*0.4); //Movimiento complejo
         //mov = vec2(sin(time*4)*0.2,cos(time*4)*0.2); //Movimiento circular
         mov = vec2(sin(time*4.)*1.0+0.5,cos(time*0.5)*0.4);
    
    
    //Defino la forma: 
    float e = sin(uv.x*100.+time*10.);
          e = smoothstep(0.88,0.90,1.-length(vec2(0.5)+mov-uv_forma)); //Circulo en una sola linea.
          //e = smoothstep(0.88,0.88,1.-length(vec2(0.5)+mov-uv)); //Circulo sin degrade
           
    //Defino el dibujo (color y forma). 
    vec3 dib = vec3(e) * hsb2rgb(vec3(sin(time)*0.5+0.5,0.8,1.0)); 
    
    //Feedback mix
    
    vec3  fin = dib;
          
          //Opcion 1 : 
          //Esta opcion genera como una especie de motion blur,o un trail de movimiento :
          //ya que lo que hace 
          fin = mix(feedback.rgb,dib,0.2); //ONDA MOTION BLUR
          
          
          //Opcion 2: 
          //Esta opcion es el equivalente a "no refrescar el background" en processing. Lo que estaba queda dibujado.
          //Y lo nuevo se dibuja por encima : 
          fin = mix(feedback.rgb,dib,dib);
          
          //También puedo multiplicar el feedback para que el rastro se vaya yendo a 0.
          //Notese la similitud entre este y la opción 1. Parecidos, no obstante, no iguales.
          //fin = mix(feedback.rgb*.95,dib,dib); 
    
    gl_FragColor = vec4(fin,1.0);
}



