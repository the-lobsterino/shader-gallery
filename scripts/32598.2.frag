#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;
uniform sampler2D backbuffer;

void main() {
	
	vec2 pos=(gl_FragCoord.xy/resolution.y);
	
	if(pos.x <= 1.5/resolution.x && pos.y <= 1.5/resolution.y){
		gl_FragColor = vec4(0.,mouse.x,mouse.y,fract(time));
		return;
	}
	vec3 frame_delta = vec3(mouse.x,mouse.y,fract(time))-texture2D(backbuffer, vec2(0.5)/resolution).yzw;
	float d_mouse_y = frame_delta.y;
	
	pos.y += 2.*d_mouse_y*sin((time*440.+pos.x*12.)*pow(2., floor((mouse.x-.5)*6.)));
	
	pos.x-=resolution.x/resolution.y/0.5;
	pos.y-=0.;
	
	float fx=0.5;
	float dist=abs(pos.y-fx)*1500.;
	gl_FragColor+=vec4(0.5/dist,1./dist,1.0/dist,1.);
	
}