#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
#define TAU 6.28

float Func(float pX) {
	return 0.6*(0.5*sin(0.1*pX) + 0.5*sin(0.6*pX) + 0.7*sin(1.2*pX));
}

float FuncR(float pX) {
	return 0.5 + 0.25*(1.0 + sin(mod(40.0*pX, TAU)));
}

float Layer(vec2 pQ, float pT) {
	vec2 Qt = 3.5*pQ;
	pT *= 0.5;
	Qt.x += pT;

	float Xi = floor(Qt.x);
	//float Xf = Qt.x - Xi -0.5;
	float Xf = fract(Qt.x)-.5;
	vec2 C;
	float Yi;
	float D = 1.0 - step(Qt.y,  Func(Qt.x));

	// Disk:
	Yi = Func(Xi + 0.5);
	C = vec2(Xf, Qt.y - Yi );
	D =  min(D, length(C) - FuncR(Xi+ pT/80.0));

	// Previous disk:
	Yi = Func(Xi+1.0 + 0.5);
	C = vec2(Xf-1.0, Qt.y - Yi );
	D =  min(D, length(C) - FuncR(Xi+1.0+ pT/80.0));

	// Next Disk:
	Yi = Func(Xi-1.0 + 0.5);
	C = vec2(Xf+1.0, Qt.y - Yi );
	D =  min(D, length(C) - FuncR(Xi-1.0+ pT/80.0));

	return min(1.0, D);
}

void main( void ) {

	vec2 UV = ( gl_FragCoord.xy / resolution.xy );
	UV = UV*2.-1.;
	UV.x *= (resolution.x/resolution.y);
	vec3 color = vec3(0.1,0.7,0.9);
	float J = .0;
	
	//Lt
	float Lt =  time*(0.5  + 1.0*J)*(1.0 + 0.1*sin(226.0*J)) + 17.0*J;
	//vec2 Lp = vec2(0.0, 0.3+1.5*( J - 0.5));
	//float L = Layer(UV+Lp , Lt);
	vec2 Qt = 3.5*UV;
	J *= 0.5;
	Qt.x += J;
	float Xi = floor(Qt.x);
	//float Xf = Qt.x - Xi -0.5;
	float Xf = fract(Qt.x)-.5;
	vec2 C;
	float Yi;
	float D = 1.0 - step(Qt.y,  Func(Qt.x));
	float a = atan(UV.y, UV.x);
	Yi = Func(Xi + 0.5);
	C = vec2(Xf, Qt.y - Yi );
	D =  min(D, length(C) - FuncR(Xi+ J/80.0));
	
	gl_FragColor = vec4( vec3(.3/Layer(UV, J)-.1), 1.0 );

}