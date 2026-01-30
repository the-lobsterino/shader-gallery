#ifdef GL_ES
precision mediump float;
#endif


#extension GL_OES_standard_derivatives : disable

//wiggled by EVERYTHINGING
//now it looks 3d with the wiggly head

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec3 getDick(vec2 position){
	
	vec3 dick = vec3(0.0);
	
	float dong = 1.0 - abs(position.x * 2.0 - 1.0);
	      dong = pow(dong + 0.1, 2.0);
	      dong = smoothstep(0.99, 1.0, dong);
	
	float toCenter = (1.0 - abs(position.x * 2.0 - 1.0));
	      toCenter = pow(toCenter*toCenter*(3.0-2.0*toCenter), 15.0);
	
	float dongMask = abs(position.y * 2.0 - toCenter);
	      dongMask = pow(dongMask + 0.1, 10.0);
	      dongMask = smoothstep(0.99, 1.0, dongMask);
	      dongMask *= pow(position.y * 5.0, 3.0);
	
	      dong = mix(dong, 0.0, dongMask);
	
	float topMask = pow(clamp(position.y * 1.35 + sin(cos(position.x*100.+(time*10.))*0.5*mouse.x), 0.0, 1.0), 90.0);
	
	vec3 dickColor = vec3(0.2, 0.2, 0.2);
	     dickColor = mix(dickColor, vec3(1.0, 1.0, 1.0), topMask);
	     dickColor = mix(dickColor, vec3(1.0, 1.0,1.0), clamp(pow(1.0 - abs(position.x * 2.0 - 1.0), 100.0), 0.0, 1.0) * pow(clamp(position.y * 1.15, 0.0, 1.0), 90.0));
	     
	float ballLeft = 1.0 - distance(position, vec2(0.4, 0.09));
	float ballRight = 1.0 - distance(position, vec2(0.6, 0.09));
	
	ballLeft = smoothstep(0.9, 0.901, ballLeft);
	ballRight = smoothstep(0.9, 0.901, ballRight);
	
	dick = dickColor * (dong + (ballRight + ballLeft) * (1.0 - dong));
	
	return dick;	
}

void main( void ) {

	vec2 position = ( gl_FragCoord.xy );
	position.x += cos((position.y*.1)+(time*10.))*5.*mouse.x;
	position.x += sin((position.y*.01)+(time*10.))*20.*mouse.y;
	position /= resolution;
	
	vec3 color = vec3(0.0);
	
	color = getDick(position);

	gl_FragColor = vec4(color, 1.0 );

}