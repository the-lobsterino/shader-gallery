#ifdef GL_ES
precision mediump float;
#endif

#define pi 3.141592

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

//just small modifications


float heart (float xarg, float yarg)
{
	float x = (1.5+0.5*sin(time))*mod(xarg+sin(time*0.2)*resolution.x/3., resolution.x/4.0) / (resolution.x/(8.0*1.2)) - 1.2;
	float y = mod(yarg+cos(time*0.2)*resolution.x/3., resolution.y/4.0) / (resolution.y/(8.0*1.3)) - 1.3;
	float left = x*x+y*y-1.0;
	float right = x*x*y*y*y;
	return left*left*left > right ? 1.0 : 0.0;
}


void main(void) 
{
	//gl_FragColor = vec4(1.0, heart(gl_FragCoord.x, gl_FragCoord.y), heart(gl_FragCoord.x, gl_FragCoord.y), 1.0);
	float posshit = 0.3-0.3*length(gl_FragCoord.xy/resolution)+0.05*sin(time);
	vec4 addshitcolor = vec4(posshit, posshit, 0.0, 0.0);
	if(heart(gl_FragCoord.x, gl_FragCoord.y)>0.5){
		if(mod(gl_FragCoord.x/resolution.x+sin(time*0.2), 0.1)<0.01){
			gl_FragColor = vec4(0.0);
		}else{
			gl_FragColor = vec4(0.8, 0.4, 0.0, 1.0)+addshitcolor;
		}
	}else{
		if(mod(gl_FragCoord.y/resolution.y+cos(time*0.2), 0.1)<0.01){
			gl_FragColor = vec4(0.0);
		}else{
		gl_FragColor = vec4(1.0, 1., 1., 1.0)+addshitcolor;
		}
	}
	
}