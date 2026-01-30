#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float f(float x){
 return 1.0*sin(x*1.0);
}

float h(float x){
 return tan(x);
}

float k(float x){
 return x*x-2.0*x+1.0;
}

void main( void ) {
	//positions
	float scale=20.0;
	vec2 position = ( gl_FragCoord.xy / resolution.xy );
	position.x=(position.x-mouse.x)*resolution.x/scale;
	position.y=(position.y-mouse.y)*resolution.y/scale;
	//ClS
	float r = 0.0, g= 0.0, b=0.0;
	//lattice
	if(abs(position.x-floor(position.x+0.5/scale))<=0.7/scale) r+=0.5;
	if(abs(position.y-floor(position.y+0.5/scale))<=0.7/scale) r+=0.5;
	//origi5
	if((abs(position.x)<=0.5/scale)||(abs(position.y)<=0.5/scale)) b+=1.0;
	//functions
	if(abs(f(position.x+time)-position.y)<=0.5/scale){ g+=1.0; b+=1.0; }
	if(abs(h(position.x+1.0*time)-position.y)<=0.5/scale){ r+=1.0; g+=1.0;}
	if((sign(h(position.x-1.0/scale+1.0*time)-position.y)==sign(position.y-h(position.x+1.0/scale+time)))&&(abs(h(position.x+1.0/scale+time)-h(position.x-1.0/scale+time))<=resolution.y/scale)){ r+=1.0; g+=1.0;}
	if(abs(k(position.x)-position.y)<=0.5/scale){ g+=1.0;}
	if(sign(k(position.x-1.0/scale)-position.y)==sign(position.y-k(position.x+1.0/scale))){ g+=1.0;}
		//octave
	if(abs(f(position.x+1.0*time)+f(position.x*2.0+1.0*time)-position.y)<=0.5/scale){ r+=1.0; g+=0.3; b+=0.5; }
	if(sign(f(position.x-1.0/scale+1.0*time)+f((position.x-1.0/scale)*2.0+1.0*time)-position.y)==sign(position.y-(f(position.x+1.0/scale+1.0*time)+f((position.x+1.0/scale)*2.0+1.0*time)))){ r+=1.0; g+=0.3; b+=0.5; }
		
		//tritonus
	if(abs(f(position.x+1.0*time)+f(position.x*pow(2.0,6.0/12.0)+1.0*time)-position.y)<=1.0/scale){ g+=0.3; b+=1.0; }
	 //bisector with weight
	if(abs(sqrt(position.x*position.x+position.y*position.y)-3.0-sqrt((position.x-16.0)*(position.x-16.0)+position.y*position.y))<=1.0/scale){r+=1.0; g+=1.0; b+=1.0;}
	//draw_it
	gl_FragColor = vec4( vec3( r, g, b), 1.0 );

}