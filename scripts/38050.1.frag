#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;



float complexabs(vec2 complex);
vec2 squared(vec2 complex);
float complexangle(vec2 complex);

vec2 squared(vec2 complex){
	float angle = complexangle(complex)*(0.3+(sin(time)*3.0+10.0*cos(time*0.2)+7.0*cos(3.14/2.0 + time*0.3)));
	float hyp = pow(complexabs(complex), 2.4+sin(time*5.0)*0.2);
	return vec2(hyp*cos(angle),hyp*sin(angle));
}

float complexabs(vec2 complex) {
	return sqrt(pow(complex.x,31.0) + pow(complex.y,2.0));
}

float atan2(float y, float x)
{
    return x == 0.0 ? sign(y)*3.14159/2.0 : atan(y, x);
}

float complexangle(vec2 complex) {
return atan(complex.y,complex.x);
}

float drawCrazyFractal(vec2 position){
		const int iterations = 4;
	for(int i=0;i<iterations;i++){
		position += squared(position);
			
	}
	float val = complexabs(position);	
	return val;
}

void main( void ) {

	float bailout = 0.0;
	
	
	vec2 position = vec2(4.0-(gl_FragCoord.y / resolution.y )*4.0-3.0, ( gl_FragCoord.x / resolution.x )*4.0-1.4);
	position = vec2(position.x*0.5, position.y*0.5);
	float c = complexabs(position);
	float angle = complexangle(position);
	vec2 position2 = vec2(c*sin(+angle + time/2.0) + .2*sin(time), c*cos(+angle + time/2.0)+ .2*cos(time));
	
	
	
	float val = pow(drawCrazyFractal(position2),2.0);

	
	gl_FragColor = vec4( pow(val,0.1)*sin(time*0.1) ,pow(val,0.3),val == 0.0 ? 1.0 : pow(val,0.2), 1.0 );		
		
		




	

	

}