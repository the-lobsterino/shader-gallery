// "Practice"

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main(void)
{
	if(mod(gl_FragCoord.x+0.5,10.0) == mod(floor(time*10.0),10.0)){
		gl_FragColor = vec4(0.0,(gl_FragCoord.x/resolution.x),0.0,0.0);
	}else{
		gl_FragColor = vec4(0.0,0.0,0.0,0.0);	
	}
}