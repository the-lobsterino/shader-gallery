#ifdef GL_ES
precision highp float;
#endif
#extension GL_OES_standard_derivatives : enable
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
//https://upload.wikimedia.org/wikipedia/commons/3/3b/QR_Format_Information.svg
void main(void){
	vec2 uv=gl_FragCoord.xy/resolution;
	vec2 p=floor(gl_FragCoord.xy);p.y=1.-p.y;
	bool pat=mod(p.x,3.)==0.;
	if(uv.x>7./8.){pat=mod(p.y*p.x,2.)+mod(p.y*p.x,3.)==0.;}
	else if(uv.x>6./8.){pat=mod(floor(p.y/2.)+floor(p.x/3.),2.)==0.;}
	else if(uv.x>5./8.){pat=mod(mod(p.y*p.x,3.)+p.y+p.x,2.)==0.;}
	else if(uv.x>4./8.){pat=mod(mod(p.y*p.x,3.)+(p.y*p.x),2.)==0.;}
	else if(uv.x>3./8.){pat=mod((p.y),2.)==0.;}
	else if(uv.x>2./8.){pat=mod((p.y+p.x),2.)==0.;}
	else if(uv.x>1./8.){pat=mod((p.y+p.x),3.)==0.;}
	gl_FragColor = vec4(mix(vec3(1.),vec3(0.),float(pat)),1.);
}