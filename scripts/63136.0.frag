#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float pA;
float pB;
float pC;
float var1;
float var2;
float fft_1;


void main( void ) {
	fft_1=3.;
	pA=0.9;
	pB=0.9;
	pC=0.9;
	float state=floor(fft_1);
	
	
	if (state == 0.0){//cyan
		var1=0.0;
		var2=2.0;
	}
	else if (state == 1.0){//whiteish		
		var1=0.2;
		var2=0.9;
	}
	else if (state == 2.0){//orange-dblue
		var1=0.3;
		var2=0.2;
	}
	else if (state == 3.0){ //yellow-blue
		var1=0.7;
		var2=0.4;
	}
	
	
	
	

	vec2 position = ( gl_FragCoord.xy / resolution.xy );
	float c = 0.0;
	c += pB*sin((var1*50.0+10.0)*position.x);
	c += pA*sin((var1*50.0+10.0)*position.y);
	c += pC*cos(var2*position.x*position.y);
	

	gl_FragColor = vec4( c, (var2+var1)*c, (var2-var1)*c, 1.0 );

}