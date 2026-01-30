#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void DrawBlue(void){
	
}

void DrawRed(void){
	
}

void main( void ) {
	
	vec2 pos = resolution / 2.0;
	pos.x += sin(time)*50.0;
	pos.y += cos(time)*50.0;
	vec2 pos2 = pos;
	pos2.x += sin(time)*250.0;
	pos2.y += cos(time)*250.0;
	
	vec2 pos3 = pos;
	vec2 pos4 = pos;
	
	pos3.x += sin(time*2.0)*300.0;
	pos4.x -= (sin(time*2.0)*300.0);
	
	float dist = length(gl_FragCoord.xy - pos);
	float dist2 = length(gl_FragCoord.xy - pos2);
	float dist3 = length(gl_FragCoord.xy - pos3);
	float dist4 = length(gl_FragCoord.xy - pos4);
	
	vec3 color = vec3(0,0,0);
	
	if(dist<abs(sin(time)*50.0)+150.0)
		color.r=1.0;
	else
		color.rgb = vec3(0.0);
	
	if(dist>abs(sin(time)*50.0)+150.0 && dist<abs(sin(time)*50.0)+151.0)
		color.r=1.0;
	
	if(dist>abs(sin(time)*50.0)+151.0 && dist<abs(sin(time)*50.0)+151.5)
		color.r=1.0;
	
	if(dist>abs(sin(time)*50.0)+151.5 && dist<abs(sin(time)*50.0)+151.75)
		color.r=0.5;
	
	if(color.r==1.0)
		color.g = (gl_FragCoord.y/resolution.y);
	else{
		color.r= (15000.0/(dist*dist));
		color.g = color.r/2.0;
	}
	
	if(dist>abs(sin(time)*50.0)+150.0){
		color += 0.01 * (abs(tan(gl_FragCoord.x * gl_FragCoord.y)*0.1));
		color *= 0.5;
	}
	
	if(dist2<50.0){
		color.rgb = vec3(0.3,0.4,0.3);
	}
	

	if(dist3<abs(sin(time)*30.0)+10.0){
		if(color.r < 0.3 || abs(sin(time)) > 0.5)
			color.rgb = vec3(0.3, 0.3, 0.6);
	} 
	if(dist4<abs(cos(time)*30.0)+10.0){
		if(color.r < 0.3|| abs(cos(time)) > 0.5)
			color.rgb = vec3(0.6, 0.3, 0.3);
	}
		
	
	gl_FragColor = vec4( color, 1.0 );

}