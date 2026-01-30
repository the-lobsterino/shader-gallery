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
uniform vec2 surfaceSize;
varying vec2 surfacePosition;

void main() {
	vec2 st = surfacePosition;//gl_FragCoord.xy/resolution.xy;
	vec2 m = (2.0*mouse-1.0) * (surfaceSize*0.5);
	
	vec3 color = vec3(0.0);
	
	if(st.x < m.x){
		color += vec3(1.0,0.0,1.0);
	} else {
		color += vec3(0.0,1.0,0.0);	
	}
	
	if(st.y < m.y){
		color += vec3(0.0,0.0,1.0);
	} else {
		color += vec3(1.0,0.0,0.0);	
	}
	
	color = normalize(color);
	
	
	
    

	gl_FragColor = vec4(color, 1.0);
}
