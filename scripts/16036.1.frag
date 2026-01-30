#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float drawLine(vec2 pos1,vec2 pos2){	
	vec2 z = ( gl_FragCoord.xy / resolution.xy )-vec2(.5,.5);
	z.x*=resolution.x/resolution.y;				   
	
	float lhs = length(z-pos1) + length(z-pos2);
	float rhs = 2.*abs(sin(time))*length(pos1-pos2);	
	
	return exp(-abs((lhs-rhs))*100.);
	
}

float drawSquare(vec2 origin,float size){
	vec2 z1 = vec2(origin.x+size,origin.y+size);
	vec2 z2 = vec2(origin.x-size,origin.y+size);
	vec2 z3 = vec2(origin.x+size,origin.y-size);
	vec2 z4 = vec2(origin.x-size,origin.y-size);
	
	float color = 0.;
	color+=drawLine(z1,z2);
	color+=drawLine(z3,z4);
	color+=drawLine(z1,z3);
	color+=drawLine(z2,z4);
	return color;
}

void main( void ) {
	
	float color = 0.;
	
	color+=drawSquare(vec2(0,0),.25);	
	
	gl_FragColor = vec4(color);
}