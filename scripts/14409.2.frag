#ifdef GL_ES
precision mediump float;
#endif

//made by KosmynC64

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

uniform sampler2D backbuffer;

float clamp(float x){
	return min(1.0,max(0.0,x));
}

float circle(vec2 position,vec2 fpos){
	return clamp(cos(20.0-distance(position,fpos)*50.0*(cos(time*0.2)+0.3))*(sin(time*0.1)*sin(time*0.1))*10.0+0.5);
}

void main() {
	vec2 uv=vec2(gl_FragCoord.x/resolution.x,
		     gl_FragCoord.y/resolution.y);
	uv.x*=cos(sin(time*0.1)*10.0+time)*0.01+1.0;
	uv.y*=sin(cos(time*0.1)*10.0+time)*0.01+1.0;
	vec2 position;
	position.x=( gl_FragCoord.x / resolution.x )*(resolution.x/resolution.y)-0.5;
	position.y=( gl_FragCoord.y / resolution.y );
	
	vec2 c1;
	c1.x=cos(time)*0.3+0.5;
	c1.y=sin(time)*0.3+0.5;
	
	vec2 c2;
	c2.x=cos(time*0.6)*0.3+0.5;
	c2.y=sin(time*1.2)*0.3+0.5;
	
	vec2 c3;
	c3.x=cos(time*0.8)*0.4+0.5;
	c3.y=sin(time*0.4)*0.3+0.5;
	
	vec3 clr;
	clr.r=circle(c1,position);
	clr.g=circle(c2,position);
	clr.b=circle(c3,position);
	
	vec4 old_clr=vec4(texture2D(backbuffer,uv).rgb,1.0);
	

	gl_FragColor = vec4(clr.r-old_clr.g,
			    clr.g-old_clr.b,
			    clr.b-old_clr.r,
			    1.0);

}