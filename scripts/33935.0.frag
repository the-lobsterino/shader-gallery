#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
float f(vec2 a,float t) {return abs(sin(atan(a.x,a.y)))/pow(length(a),t);}
void main(void) {
	vec2 uv = (gl_FragCoord.xy*2.)/resolution.y-vec2(1.8,0);
	float a=sin(time*5.)*5.+6.;
	bool b=f(uv,a)<0.9;
	if(abs(uv.x)<.3+(sin(time*5.)/1e2)&&b){b=f(uv,a)>0.7;}
	vec2 c=vec2(uv.x,(1.8-uv.y)+(sin(time*5.)*.05))*3.;
	if(f(c,4.)>.7||uv.y>(c.y+2.)){b = f(c,4.+(sin(time*5.)*uv.y))<.9;}
	if(b){gl_FragColor=vec4(1,1,1,1);}else{gl_FragColor=vec4(.9,1.-uv.y/3.,.5,1);}
}