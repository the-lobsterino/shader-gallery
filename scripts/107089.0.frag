#ifdef GL_ES
precision mediump float;
#endif

//Water absorption and scattering of dirt inside of the water
#define PI 3.14159 
#extension GL_OES_standard_derivatives : enable
precision mediump float;
uniform float time;
uniform vec2  mouse;
uniform vec2  resolution;
vec3 color = vec3(0.722,0.544,0.888);
void main(void){
	vec2 m = vec2(mouse.x * 2.0 - 1.0, mouse.y * 4. - 8.);
    	vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
	vec3 t=vec3(0.0);
	for(float j=0.;j<2.;j++){
    		for(float i=0.;i<5.;i++){
			vec2 q=p+vec2(sin(time+(i*PI*0.4))*(1.+j),cos(time+(i*PI*0.4)))*0.5;
			t += 0.01/length(q);
		}
	}
	gl_FragColor = vec4(vec3(t), 1.0);
}