#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main(){
	
	vec2 pos=(gl_FragCoord.xy/resolution.xy);
	pos.y-=0.5;
	pos.y+=sin(pos.x*10.0+time)*0.2*sin(time);
	vec3 color=vec3(1.0-pow(abs(pos.y),0.5*pos.x));
	vec3 colora=vec3(0.4-pow(abs(pos.x),0.5*pos.y));
	
	gl_FragColor=vec4(colora.r*0.2,(color.g - colora.g)*0.2,color.b*1.0,1.0);
		
}