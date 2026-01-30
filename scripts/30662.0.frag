#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float rand(int n){return fract(sin(float(n)) * 43758.5453123);}

void glow(float d){   
  gl_FragColor.rgb+=vec3(0.2,0.5,0.7)/pow(d,1.2);	
}

void point(vec2 p, float size){
	p.x*=resolution.x/resolution.y;  
	vec2 fc=gl_FragCoord.xy;
	p+=0.5;
	p*=resolution;	
  	float d=distance(p,fc);
        glow(d/size);
}


void main( void ) {
	gl_FragColor = vec4( vec3( 0.0), 0.0 );
	for(int i=1;i<16;i++){
		float speed=0.2;
		float x=fract(rand(i+45))-0.5;
                x=fract(x+time*(speed*rand(i+76)+0.05))-0.5;
		point(vec2( x , rand(i)-0.5), rand(i+2)*30.0);
	}	
}