#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec2 position;

float getFuncValue(float x){
//	return abs(sin(x/10.0) * (x/10.0));	

	float v = sin(x)  + sin(x/2.) + sin(x/4.)/4. + sin(x/8.) + sin(x/16.) + sin(x/32.) + sin(x/64.);
		
	return 2.*v;
	
}

vec3 plot(){
	float val = getFuncValue(position.x);
	float dist = 0.4 / distance(position, vec2(position.x, val * 2.0));
	return vec3(dist, 0.0, 0.0);
}

void main( void ) {

	position = ( gl_FragCoord.xy / resolution.xy );
	position.y = position.y * resolution.y/resolution.x + 0.25;
	position.x = (position.x - 0.5) * 100.0;
	position.y = (position.y - 0.5) * 100.0;
	vec2 mousepos = mouse;
	mousepos.y = mouse.y * resolution.y/resolution.x + 0.25;
	
	vec3 color = vec3(0.0);
	float ratio = resolution.x / resolution.y;
	
	if(abs(position.x) < 0.2) color += vec3(0.4);
	if(abs(position.y) < 0.2 / ratio) color += vec3(0.4);
	
	color += plot();
	
 	color.g +=  0.4 * fract(time * position.y / position.x);

	
	gl_FragColor = vec4(color, 1.0 );

}