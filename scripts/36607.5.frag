#ifdef GL_ES
precision highp float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D backbuffer;

float color = .1;

vec4 zero = vec4(0.0,0.0,0.0,0.);
vec4 one = vec4(color,0.0,0.0,0.0);
vec2 center = vec2(.5, .5);


void main( void ) {
	vec2 position = ( gl_FragCoord.xy / resolution.xy );
	vec2 pixel = 1./resolution;
	int N, E, W, S, C;
	
		
	
	if (position.x > .8 ||position.x < .2 || position.y > .9 || position.y < .1){
		gl_FragColor = texture2D(backbuffer, position + pixel * vec2(0., 0.)) - one;    //set to zero here
	} else if (length(position-mouse) < .01){
		gl_FragColor = float(4)*one;	//where the source is

	} else {
		//which neighbors will fire
		if (texture2D(backbuffer, position + pixel * vec2(-1., 0.)).r >= one.r*float(4)){
			N = 1;
		} else {
			N = 0;} 
		
		if (texture2D(backbuffer, position + pixel * vec2(1., 0.)).r >= one.r*float(4)){S = 1;} else {S = 0;} 
		if (texture2D(backbuffer, position + pixel * vec2(0., 1.)).r >= one.r*float(4)){E = 1;} else {E = 0;} 
		if (texture2D(backbuffer, position + pixel * vec2(0., -1.)).r >= one.r*float(4)){W = 1;} else {W = 0;} 
		
		//if i will fire
		if ((texture2D(backbuffer, position).r + one.r*float(N + E + W + S)) >= one.r*float(4)){
			C = -4;} else {C = 0;} 
		
		gl_FragColor = texture2D(backbuffer, position) + one*float(N+E+W+S+C);	  
	}
}