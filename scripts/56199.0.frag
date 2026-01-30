//by 834144373 

// I just want to make a flame...please help me!!!

// I try it!!!
#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 pos = ( gl_FragCoord.xy / resolution.xy )*8.-vec2(4.,5.);// + mouse / 4.0;
	
	if(pos.y>-6.){
		pos.y += 0.1*sin(time*3.)+0.13*cos(time*2.+0.6)+.1*sin(time*3.+0.4)+0.2*fract(sin(time*400.));
	}

	vec3 color = vec3(0.,0.,0.0);
	
	float p =.006;
	
	float y = -pow(pos.x,3.2)/(2.*p)*3.3;
	
	
	float dir = length(pos-vec2(pos.x,y))*sin(0.3);//*(0.01*sin(time)+0.07);
	
	if(dir < 0.7){
		color.rg += smoothstep(0.0,1.,.75-dir);
		color.g /=2.4;
	}
	color += pow(color.r,1.1);
	
	gl_FragColor = vec4(vec3(color) , 1.0 );

}