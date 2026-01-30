//Some rainy fooling.
//IG: @Lisandro.Peralta 
#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable


uniform float time;
uniform vec2 resolution;
uniform vec2 mouse;


void main(void)
{

	vec2 uv = vec2 (gl_FragCoord.xy / resolution.xy);
	vec3 gradiente1= vec3(uv.y-fract(time+uv.y*3.+sin(uv.x*2.+sin(uv.x*9.+sin(uv.x*11.+time)+time)+time)));
	vec3 gradiente2= vec3(uv.y-fract(time*0.8+uv.y*3.+sin(uv.x*2.+sin(uv.x*8.5+sin(uv.x*11.5+time*1.5)+time*1.5)+time*2.)));
	vec3 gradientes = vec3 (gradiente1-gradiente2);
	vec3 lluvia= vec3(step(   sin(uv.x*500.+sin(uv.y*50.+fract(uv.y*9.+time))     )    ,0.5)+gradientes);
	vec3 final= vec3(mix (lluvia, gradientes, lluvia ));
    
	gl_FragColor = vec4 (final,1.0);
}