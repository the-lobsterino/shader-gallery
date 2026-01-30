#ifdef GL_ES
precision mediump float;
#endif
#extension GL_OES_standard_derivatives : enable
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
float linearGradient(vec2 uv,vec2 p0,vec2 p1){return dot(uv-p0,p1-p0)/dot(p1-p0,p1-p0);}
float rand(float x){return fract(sin(x*1965.23674)*6945.5296)+sin((time+x)/1.);}
float texture(vec2 uv){
	float o=0.;
	for(int i=0;i<32;i++){
		vec2 p0=vec2(rand(float(i*0)   ),rand(float(i*4)+1.)),
		     p1=vec2(rand(float(i*0)+2.),rand(float(i*8)+3.));
		o=abs(o-linearGradient(uv,p0,p1));
		
		
	}
	return o;
}
void main(void){
	vec2 uv=gl_FragCoord.xy/resolution;
	uv.x=((uv.x-.5)*(resolution.x/resolution.y))+.5;
	float o=((texture(uv)+1.)/2.)-texture(uv-.08);
	vec3 c=mix(vec3(.5,0.,0.),vec3(2.,.5,.2),o);
	gl_FragColor=vec4(c,10.);
}