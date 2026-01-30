#ifdef GL_ES
precision mediump float;
#endif
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

//JULIO NUÑEZ - ITMAZ - simple perlin noise

// Shabby - parallax frost mod
float rand( float x, float y ){return fract( sin( x + y*0.1234 )*1234.0 );}

float interpolar(vec2 cord, float L){
   	float XcordEntreL= cord.x/L;
        float YcordEntreL= cord.y/L;
    
	float XcordEnt=floor(XcordEntreL);
        float YcordEnt=floor(YcordEntreL);

	float XcordFra=fract(XcordEntreL);
        float YcordFra=fract(YcordEntreL);
	
	float l1 = rand(XcordEnt, YcordEnt);
	float l2 = rand(XcordEnt+1.0, YcordEnt);
	float l3 = rand(XcordEnt, YcordEnt+1.0);
	float l4 = rand(XcordEnt+1.0, YcordEnt+1.0);
	
	float inter1 = (XcordFra*(l2-l1))+l1;
	float inter2 = (XcordFra*(l4-l3))+l3;
	float interT = (YcordFra*(inter2 -inter1))+inter1;
    return interT;
}

#define N 12
void main(void)
{	
	float color, color2 = 0.0;
	
	for ( int i = 0; i < N; i++ ){
		float p = fract(float(i) / float(N) - time*.05 );
		float q = fract( float(i) / float(N) - time*.04999 );
		float a = p * (1.0-p);
		color += a * (interpolar(gl_FragCoord.xy-resolution/2., resolution.y/pow(2.0, p*p*float(N)))-.5);
		color2 += a * (interpolar(gl_FragCoord.xy-resolution/2., resolution.y/pow(2.0, q*q*float(N)))-.5);
	}
	color += .5;
	vec3 out1 = color * vec3(.5,.0,1.0);
	vec3 out2 = color2 * vec3(0.4,1.0,0.0);

	gl_FragColor = vec4(out1-out2,1.0) ;
	
}