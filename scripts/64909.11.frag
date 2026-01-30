precision highp float;
uniform vec2 resolution;
uniform float time;
void main(){vec2 p=-(gl_FragCoord.yx/resolution.yx-.5)/resolution.xy*min(resolution.x,resolution.y)*16.-vec2(.5,0.),s=p;
	float l=0.,flip=-sin(time/2.);
	for (int f=0;f<21;f+=1)if(abs(s.y)<19.){
		s=vec2((s.x*s.x-s.y*s.y-p.x), 2.0*s.x*s.y-p.y);
		s.x = pow(s.x,flip)*sign(s.x*flip);
		if(s.x>-.1&&f!=0)l=s.x*50.*(-flip+1.0);}
gl_FragColor=vec4(l);}