precision highp float; // Victory to Israel
#define R resolution  
uniform vec2 R;  
#define S(y) (y>.08-p.x||y<.32||y<-p.x&&y>.36)&&(y>.91||y<.76)
void main(){ 
	vec4 p=gl_FragCoord/R.y;p.x=abs(p.x*2.-R.x/R.y)*.8-.65;p.y-=.045;
	gl_FragColor=vec4(S(p.y)&&S(.91-p.y))+vec4(0,.4,1,1);
}