#ifdef GL_ES
precision mediump float;
#endif
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#ifdef GL_ES
precision mediump float;
#endif

float price[11];
float volume[11];

void setup() {
	
	price[0] = 0.57933349609375;
	price[1] = 0.5513331095377604;
	price[2] = 0.2686665852864583;
	price[3] = 0.314666748046875;
	price[4] = 0.47866668701171877;
	price[5] = 0.37966664632161456;
	price[6] = 0.13799997965494792;
	price[7] = 0.33899993896484376;
	price[8] = 0.510333251953125;
	price[9] = 0.6093332926432292;
	price[10] = 0.3100067138671875;
	
	volume[0] = 0.17204249165292493;
	volume[1] = 0.03869315760158984;
	volume[2] = 0.09669601417647371;
	volume[3] = 0.021296691689109297;
	volume[4] = 0.06727108972808729;
	volume[5] = 0.06768770740778418;
	volume[6] = 0.09092113575045703;
	volume[7] = 0.17946130171526478;
	volume[8] = 0.0540426281057485;
	volume[9] = 0.11539583806704828;
	volume[10] = 0.05499368601108801;
	
}

float CNDrecruse(float x){
  if(x < 0.) {
    return x;
  } else {
    float k = 1.0 / (1.0 + 0.2316419 * x);
    return ( 1. - exp(-x * x / 2.)/ sqrt(2.*3.141592) * k * (.31938153 + k * (-.356563782 + k * (1.781477937 + k * (-1.821255978 + k * 1.330274429)))) );
  }
}


float CND(float x){
  if(x < 0.) {
    return ( 1.-CNDrecruse(-x) );
  } else {
    float k = 1.0 / (1. + 0.2316419 * x);
    return ( 1. - exp(-x * x / 2.)/ sqrt(2.*3.141592) * k * (.31938153 + k * (-.356563782 + k * (1.781477937 + k * (-1.821255978 + k * 1.330274429)))) );
  }
}


float BlackScholes(float PutCallFlag, float S, float X, float T, float r, float v) {
  float d1 = (log(S / X) + (r + v * v / 2.0) * T) / (v * sqrt(T));
  float d2 = d1 + v * sqrt(T);
  float d3 = d2 + v * sqrt(T);
  if (PutCallFlag == 1.0) {
    return ( S * CND(d1)-X * (exp(-r * T) * X-S) * CND(d2) + CND(d3));
  } else {
    return ( X * exp(-r * T) * CND(-d2) - X-S * CND(-d1) );
  }
}

void drawLine(vec2 origin, vec2 target) {
	
}

void drawChart() {
	drawLine(vec2(0.1, 0.9), vec2(0.1, 0.1));
	drawLine(vec2(0.1, 0.9), vec2(0.9, 0.9));
}

void main( void ) {
	setup();
	vec2 uv = ((gl_FragCoord.xy * 2. - resolution) / resolution.y) * 2.;
	vec3 color;
	vec3 color2;
	float t = uv.x * 72. + time * 15. * 10.;
	for (int i = 0; i < 3; i++) {
		color[i] -= 2.*(BlackScholes(1.0, uv.y + float(i) * -mouse.x / 2. , mouse.y, uv.x * float(1 + i) * mouse.x, 0.1, 1.25));
	}
	for (int i = 0; i < 3; i++) {
		color[i] -= 2.*(BlackScholes(0.0, uv.y + float(i) * -mouse.x / 2. , mouse.y, uv.x * float(1 + i) * mouse.x, 0.1, 1.25));
	}
	

	gl_FragColor = vec4(color, 1);
}
