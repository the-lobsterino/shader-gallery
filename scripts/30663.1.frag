#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float rand(int n){return fract(sin(float(n)) * 43758.5453123);}
int ii;
	
void glow(float d){   
  //gl_FragColor.rgb+=vec3(0.2,0.5,0.7)/pow(d,1.2);	
  gl_FragColor.rgb+=vec3(rand(ii),rand(ii+21),rand(ii+78))/pow(d,1.6);		
}





void point(vec2 p, float size){
	p.x*=resolution.x/resolution.y;  
	vec2 fc=gl_FragCoord.xy;
	p+=0.5;
	p*=resolution;	
  	float d=distance(p,fc);
        glow(d/size);
}

void hvost(vec2 p, float size){		
	float cent=(size/resolution.y)/2.0;
	
	for(int i=0;i<18;i++){	  	
	  float x=p.x-(fract(rand(i+45)+time)*0.1);	
          float d=p.x-x;		
	  float y=p.y+sin(d*40.0+time*4.0)*d;
	  //float y=p.y+((fract(rand(i)*0.1))*(d*cent*100.0));	  	
	  point(vec2(x,y), 1.0);	
	}        
}


void main( void ) {
	gl_FragColor = vec4( vec3( 0.0), 0.0 );
	for(int i=1;i<7;i++){
		ii=i;
		float speed=0.1;
		float x=fract(rand(i+45))-0.5;
                x=fract(x+time*(speed*rand(i+76)+0.05))-0.5;
		
		float y=rand(i)-0.5;
		
		point(vec2( x , y), 5.0+rand(i+2)*15.0);
		hvost(vec2( x , y), 5.0+rand(i+2)*15.0);
	}	
}