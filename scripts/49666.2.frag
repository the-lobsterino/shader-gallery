#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;



void draw(out vec3 color, vec2 pos){
	//world away
	
	float dis=distance(pos, vec2(0.0));
	color=vec3(sin(dis*time/2.0),0.2,sin(dis)) ;

	//color=vec3(0.2);
}

void main( void ) {

	vec2 pos=(gl_FragCoord.xy/resolution.xy)*2.0-1.0;
	pos.x*=resolution.x/resolution.y;
	
	vec3 color=vec3(0.2);
	
	draw(color, pos);
	
	
	gl_FragColor=vec4(color,1.0);
	
	
	
	
        

}