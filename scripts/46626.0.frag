#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float f(float x){
 return sin(x);
}

float h(float x){
 return tan(x);
}

float k(float x){
 return x*x-2.0*x+1.0;
}

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy );

	float r = 0.0, g= 0.0, b=0.0;
	position.x=(position.x-0.5*mouse.x)*10.0*resolution.x/resolution.y;
	position.y=(position.y-0.35)*10.0 * mouse.y;
	if(abs(f(position.x)-position.y)<=0.05){ g+=1.0; b+=1.0; }
	if(abs(position.x-floor(position.x+0.5))<=0.02) r+=1.0;
	if(abs(position.y-floor(position.y+0.5))<=0.02) r+=1.0;
	if((abs(position.x)<=0.03)||(abs(position.y)<=0.03)) b+=1.0;
	if(abs(f(position.x+time)-position.y)<=0.05){ g+=1.0; b+=1.0; }
	if(abs(h(position.x+time)-position.y)<=0.05){ r+=1.0; g+=1.0;}
	if(abs(k(position.x+7.*sin(time))-position.y+sin(time))<=0.05){ g+=1.0;}
	
	gl_FragColor = vec4( vec3( r, g, b), 1.0 );

}