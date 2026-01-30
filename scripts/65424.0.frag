// 120620N mod.

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

vec3 f(float _freq) {
	vec2 uv = gl_FragCoord.xy / resolution.xy ;
   	float freq = _freq*PI; 
	
	float variacion1= sin (uv.x*freq)*.1;
	float variacion2= sin (time-uv.y*freq)*.1;
	float cuadricula= variacion2-variacion1;
	vec3 gradiente = vec3(.1,sin(uv.y-time),1.);
	vec3 salida1 = vec3(cuadricula/gradiente);
	
	float columnas = sin(uv.x*freq+sin(uv.y*freq+time*2.)*.9);
			
	return salida1/columnas;
}


void main ( void ) {	
	// gl_FragColor = vec4(f(10.), 1.0);
		
	vec3 c = f(10.*sin(time*0.1)); // vec3(.5);
	for (float i=0.;i<2.;i++) {
		c.x += f(c.x).x;
		c.y += f(c.y).y;
		c.z += f(c.z).z;
	}
	gl_FragColor = vec4(c, 1.0);
}