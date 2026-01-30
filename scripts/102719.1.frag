#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define PI 3.14159265359

mat2 rotate2d(float  ugol_povorota){ // обычная матрица поворота по углу
    return mat2(cos(ugol_povorota),-sin(ugol_povorota), sin(ugol_povorota),cos(ugol_povorota));
}

void main( void ) { 	// функция вызывается для каждой точки(gl_FragCoord.xy) на экране
	

  	vec2 st = gl_FragCoord.xy/resolution.xy;
	st.x *= resolution.x/resolution.y ; 	
  	st = st *2.-1.; 			
     	st = rotate2d( sin(time)) * st; 
	
  	float a = atan(st.x,st.y);
  	float r = PI*2.0/3.;
	float d = cos(floor(.5+a/r)*r-a)*length(st);
 
  gl_FragColor = vec4(vec3(1.0-smoothstep(0.12,0.33,d)),1.0);
}