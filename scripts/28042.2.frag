precision highp float;
uniform float time;
uniform vec2 resolution;
#define t time
void main(){
	vec3 d=normalize(vec3(gl_FragCoord.xy-resolution.xy/2.,resolution.x/2.));
	d.xy*=mat2(cos(t),sin(t),-sin(t),cos(t));
	vec3 s=vec3(0);
	for(int i=0;i<64;i++){
		s+=d*(length(mod(s+vec3(0,0,t*4.),4.)-2.)-1.);
	}
	gl_FragColor=vec4(abs(sin(s+t))*1e1/dot(s,s),1);
}