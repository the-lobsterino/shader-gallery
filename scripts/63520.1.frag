#ifdef GL_ES
precision highp float;
#endif
// dashxdr was here
uniform float time;
uniform vec2 resolution;
float tm;
vec3 pos;
float f(vec3 x){
	float a=(x.z*0.15);
	x.xy*=mat2(cos(a),sin(a),(-sin(a)),cos(a));
	return length((cos(tm+x.xy)+sin(tm+x.yz))) - .015;
}
void main(){
	tm = time*.1;
	pos = vec3(10.*(gl_FragCoord.xy-resolution.xy*.5)/resolution.y,0.);
	vec3 p=pos;for(int i=0;i<128;i++)p+=f(p)*vec3(0., 0., 0.5);
	gl_FragColor=vec4(((vec3(4.,2.0,1.)+0.*sin(p))/length(p.z)),1.0);
}