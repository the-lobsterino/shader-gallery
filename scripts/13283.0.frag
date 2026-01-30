#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;

const int iter=128;

float rand(vec2 co){ //ok alor sa jlé trouvé sur le net
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}
void main( void ) {
	
	// slt (mm) ppr c:>*
	
	//float zoom=(sin(time/4.0)+1.0)/8.0;
	//zoom=zoom*zoom;
	
	//vec2 position = ( gl_FragCoord.xy / (resolution.xy) )*zoom -vec2(zoom/2.0+0.002,zoom/2.0+0.650001325) ;
	
	vec2 ppos = surfacePosition.xy*10.;
	vec2 position = vec2(-ppos.y, ppos.x);
	
	
	
	//position.x=position.x*(16.0/9.0);

	float color = 0.0;
	float color2 = 0.0;
	float color3 = 0.0;	
	float x=0.0;
	float y=0.0;
	float ix=0.0;
	float iy=0.0;
	float z=0.0;
	int count=0;
	
	float power=2.0 + 0.15*sin(time*0.1);
	
	for(int i=0; i < iter/4; ++i){
		count = i;
		ix = pow(x, power) - pow(y, power) + position.x;
		iy = power * x * y + position.y;
		x = ix;
		y = iy;
		z = x * x + y * y;
		if (z>20.0) break;
	}
	
	float fcount = float (count);
	color = sin(fcount*0.01);
	
	power=2.0 + 0.15*sin(time*0.1+0.3);
	
	for(int i=0; i < iter/4; ++i){
		count = i;
		ix = pow(x, power) - pow(y, power) + position.x;
		iy = power * x * y + position.y;
		x = ix;
		y = iy;
		z = x * x + y * y;
		if (z>20.0) break;
	}
	
	float fcount2 = float (count);
	color2 = sin(fcount2*0.01);
	
	power=2.0 + 0.15*sin(time*0.1+0.9);
	
	for(int i=0; i < iter/4; ++i){
		count = i;
		ix = pow(x, power) - pow(y, power) + position.x;
		iy = power * x * y + position.y;
		x = ix;
		y = iy;
		z = x * x + y * y;
		if (z>20.0) break;
	}
	
	float fcount3 = float (count);
	color3 = sin(fcount3*0.01);
	
	//color=color*color*((rand(vec2(time,time))-0.5)*2.0)*rand(vec2(x,y)); // >:)))
	
	gl_FragColor = vec4(color, color2, color3, 1.0);
	
}