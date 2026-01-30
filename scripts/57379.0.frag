#ifdef GL_ES
precision highp float;
#endif

uniform vec2 resolution;
uniform float u_time;


float rect(in float x1, in float y1, in float x2,in float y2, in vec2 frag){
	float x_1 = step(x1,frag.x);
	float y_1 = step(y1,frag.y);
	float x_2 = step(x1,x2 - frag.x);
	float y_2 = step(y1,y2 - frag.y);
	return x_1 * y_1 * x_2 * y_2;
}
void main(){
	//normalize resolution
	vec2 frag = gl_FragCoord.xy/resolution.xy; 
	//Draw rect 1
	float rect1 = rect(0.0,0.0,0.2,0.2,frag); 
	float rect2 = rect(0.2,0.5,2.0,2.0,frag); 
	
	rect1 += rect2;
	
  	gl_FragColor = vec4(rect1,0.5,rect2,1.0);
}