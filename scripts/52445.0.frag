/*
	Programado por Brais S.
	Probando cosas... (Testing stuff)
*/


#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;

void main() {
	vec2 st = gl_FragCoord.xy/resolution.xy;
	
	vec3 color;
	vec2 p=vec2(0.5+0.2*sin(time),0.5+0.3*cos(time));
	
	if(st.x < p.x){
		color += vec3(1.0,0.0,1.0);
	} else {
		color += vec3(0.0,1.0,0.0);	
	}
	
	if(st.y < p.y){
		color += floor(vec3(sin(time*30.0),0.8,0.0));
	} else {
		color += vec3(1.0,0.0,0.0);	
	}
	
	color = normalize(vec3(color.y,color.z,color.x));
	
	
	
    

	gl_FragColor = vec4(color, 1.0);
}
