#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float Lx = 1.0;
float Ly = 1.0;

float m0 = 3.0;
float n0 = 2.0;

float sens = 0.15;
float vel = 0.0;

float pi = 3.14159265359;

float grey = 0.2;

//CIRCULAR

float fact(float num){
	float f = 1.0;
	for (float i = 1.0; i <= num; i++) {
		f *= i;
	}
	return f;
}

float gamma(float num){
	return fact(num - 1.0);
}

void main( void ) {

	vec2 pos = (( gl_FragCoord.xy / resolution.xy ) - vec2(0.5)) * vec2(Ly);
	pos.x *= resolution.x/resolution.y;
	
	
	float n = n0 + (time * vel);
	float m = m0;
	
	if ((pos.x<(resolution.y/resolution.x)*Lx) && (pos.x>(-resolution.y/resolution.x)*Lx)){
	
		float z = cos(n * pi * pos.x / Lx) * cos(m * pi * pos.y / Ly) + cos(n * pi * pos.y / Ly) * cos(m * pi * pos.x / Lx);
		float dist=abs(z)*(1.0/sens);
		gl_FragColor=vec4(1.5/dist,0.5/dist,0.1/dist,1.0);
		
	}else{
		gl_FragColor = vec4(grey, grey, grey, 1.0 );
	}
	
}