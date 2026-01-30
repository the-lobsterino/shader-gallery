#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float snow(float x, float y, vec2 position) {
	float dist = pow(1.0 - distance(y, position.y), 4.0);
	dist *= pow(1.0 - distance(x, position.x), 4.0);
	dist = max(0.0, mix(-5.0, 1.0, dist));
	
	return dist;
}

float fs(float x) {
	return sin(x*3.1415*10.0);
}
float fc(float x) {
	return cos(x*3.1415*10.0);
}

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy );
	
	float mx = fs(position.y + time / 10.0)/10.0-0.9;
	float bx = fs(position.y + time / 10.0)/10.0-0.1;
	
	float my = fs(position.x + time / 10.0)/10.0+0.5;
	float by = fc(position.x + time / 10.0)/10.0+0.5;
	
	float dist = pow(1.0 - distance(my, position.y), 10.0)*sin(position.x);
	
	dist += pow(1.0 - distance(by, position.y), 10.0)*sin(position.x+1.57);
	dist += pow(1.0 - distance(mx, position.x), 4.0);
	dist += pow(1.0 - distance(bx, position.x), 4.0);
	
	vec3 color = vec3(0.1, 0.5, 0.9);
	
	color *= dist;
	

	gl_FragColor = vec4( color, 0.5 );

}