#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	//I call it the big messy blob thingie
	vec3 color;
	vec2 pos = vec2(gl_FragCoord.x / resolution.x, gl_FragCoord.y / resolution.y);
	
	float x = (pos.x * 2.0);
	
	vec2 snowpos = vec2(time, sin(time*10.0)+1.0);
	
	if(distance(pos, snowpos) < 2.0){
		color = vec3(0.0, 1.0, 0.0);	
	}else{
	
		if(sin(x*10.0)+1.0 >= (pos.y/0.5) - 0.02 && sin(x*10.0)+1.0 <= (pos.y/0.5) + 0.02){
			color = vec3(1.0, 0, 0);
		}else{
			color = vec3(0.0, 0, 0);	
		}
	}
	
	
	
	gl_FragColor = vec4(color, 0.0);
}