#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

//COMO EL NUMERO PI NO VIENE INCLUDO EN GLSL LO DEFINIMOS MANUALMENTE.
//Utilizamos la estructura #define para definir constantes en el programa.
#define PI 3.14159265359

void main( void ) {

	vec2 uv = gl_FragCoord.xy / resolution.xy ;
   	float freq = 10.*PI; 
	
	float variacion1= sin (uv.x*freq)*.1;
	float variacion2= sin (time-uv.y*freq)*.1;
	float cuadricula= variacion2-variacion1;
	vec3 gradiente = vec3(.1,sin(uv.y-time),1.);
	vec3 salida1 = vec3(cuadricula/gradiente);
	
	float columnas = sin(uv.x*freq+sin(uv.y*freq+time*2.)*.9);
	
	vec3 salidaFinal=vec3(salida1/columnas);
	
	vec3 color = vec3 (salidaFinal);

	gl_FragColor = vec4( color, 1.0 );

}