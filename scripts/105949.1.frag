#extension GL_OES_standard_derivatives : enable
precision highp float;
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
bool pInRect(vec2 p,float x,float y,float w,float h){return p.x>=x&&p.x<x+w&&p.y>=y&&p.y<y+h;}
vec2 rotateP(vec2 p,float a){return vec2(p.x*cos(a)-p.y*sin(a),p.x*sin(a)+p.y*cos(a));}
float pointDirection(vec2 a,vec2 b){return atan(b.y-a.y,b.x-a.x);}
void main(void){
	vec2 uv=gl_FragCoord.xy;
	vec3 c=vec3(0.);
	for(int i=0;i<60;i++){
		float x=300.-float(i*3),y=200.-float(i*10),w=3.,h=800.,a=-pointDirection(vec2(x+(w/2.),y+(h/2.)),mouse*resolution);
		c+=vec3(
			pInRect(rotateP(uv-vec2(x+(w/2.),y+(h/2.)),a-.1)+vec2(w/2.,h/2.),0.,0.,w,h)?1.:0.,
			pInRect(rotateP(uv-vec2(x+(w/2.),y+(h/2.)),a)+vec2(w/2.,h/2.),0.,0.,w,h)?1.:0.,
			pInRect(rotateP(uv-vec2(x+(w/2.),y+(h/2.)),a+.1)+vec2(w/2.,h/2.),0.,0.,w,h)?1.:0.
		);
	}
	gl_FragColor=vec4(c,1.);
}