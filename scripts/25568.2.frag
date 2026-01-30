precision mediump float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float getStripe (float arg){
	//like clip space paramaters, -1 to 1
	float pos = mod(arg, 10.0) / 5.0 - 1.0;
	
	float porabola = 1.0 - pos * pos;
	
	
	return porabola;
}

bool generateCircle (vec2 pos, vec2 pos2, float radius){
	if (length(pos2 - pos) < radius){
		return true;
	}
	
	return false;
}

void main( void ) {
	vec3 color = vec3(0);
	
	color.x = getStripe(gl_FragCoord.y + time * 10.0);
	color.y = getStripe(gl_FragCoord.x + time * 10.0);	
	color.z = getStripe(sqrt(gl_FragCoord.x + gl_FragCoord.y) + time * 10.0);
	
	if (generateCircle(resolution / 2.0, gl_FragCoord.xy, 60.0)){
		color += vec3(0.6, 0.7, 0.2);
	}
	
	gl_FragColor = vec4(color, 1);
}