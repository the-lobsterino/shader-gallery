//xL
#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
float pi=3.14159265;
vec3 color = vec3 (.0,.0,.0);
float ratio = resolution.x/resolution.y;
float freq = 7.;
float ti = time*.30;
vec3 col = vec3 (.0,.3,.0);
float edge = .2;
float edgeW = .12;
float lineW = .04;
int i = 5;

void main( void ) {
	
	vec2 p = ( gl_FragCoord.xy / resolution.xy )*vec2(2.0,2.0/ratio) - vec2(1.0,1.0/ratio);
		
		
	for(int j = 1; j < 44; j++){
	
	float jf = float(j);
	float a = sin(freq*p.x+jf/8.+.1*ti*jf)+(p.y*2.0+1.0*.25)*1.;
	//a=a*(.5+.5*(sin(jf*jf*jf+ti*.5)))+(sin(jf*jf*jf+ti*.5))*.5;
	float b = smoothstep(edge,edge+edgeW, a)-smoothstep(edge+lineW,edge+edgeW+lineW, a);
			
	float h = b;
		float k = mod(float(j),3.);
		if(k == 0.0){
		color.r += h;}
		else if(k == 1.0){ 
		color.g += h;}
		else {color.b += h;}
			
		
	gl_FragColor = vec4(color, 1.);				
			
	}	
}	
	