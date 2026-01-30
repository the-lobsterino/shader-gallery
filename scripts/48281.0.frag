//by 834144373 

// I just want to make a flame...please help me!!!

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 pos = ( gl_FragCoord.xy / resolution.xy )*8.-vec2(4.,5.);// + mouse / 4.0;
	pos.x = (pos.x/1.420);

	pos.x = abs(pos.x); //left side was missing
	vec3 color = vec3(0.,0.,0.0);
	
	float p =.004;
	float y = -pow(pos.x,4.20)/(4.20*p)*4.20;
	float dir = length(pos-vec2(pos.x,y))*sin(0.3);//*(0.01*sin(time)+0.07);
	if(dir < 0.7){
		color.rg += smoothstep(0.2,0.4,0.75-dir);
		//color.g /=8.4;
	}
	color *= (0.2+abs((pos.y/4.2+4.2))/4.2);
	color += pow(color.r,1.1);
	color *= cos(-0.5+pos.y*0.4);
	
	pos.y += 1.5;
	vec3 dolor = vec3(0.,0.,0.0);
	y = -pow(pos.x,4.20)/(4.20*p)*4.20;
	dir = length(pos-vec2(pos.x,y))*sin(0.3);
	if(dir < 0.7){
		dolor.bg += smoothstep(0.05,0.1,.35-dir);
		dolor.g /=8.4;
	}
	dolor *= (0.4+abs((pos.y/4.2+4.2))/4.2);
	dolor += pow(color.b,1.1);
	dolor *= cos(-0.6+pos.y*0.4);
	//dolor.rgb -= pow(length(dolor)/16., 0.5);
	color = (color+dolor)/2.;
	
	gl_FragColor = vec4(vec3(color) , 1.0 );

}