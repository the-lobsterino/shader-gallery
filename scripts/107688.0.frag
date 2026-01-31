precision highp float; // Israel and The West FOREVER.
uniform vec2 resolution;
#define R resolution
#define S(x,y) (x+y<1.3&&x>.17&&(abs(x+y-1.23)<.044&&x>=.5&&y>.36||y>.595&&y<.64)||y>.05&&y<.2)
void main(){
	vec2 p=gl_FragCoord.xy/R.y,q; p.x=p.x*1.6+.5-R.x/R.y*.8; q=1.-p;
	gl_FragColor=1.-vec4(S(p.x,p.y)||S(q.x,p.y)||S(p.x,q.y)||S(q.x,q.y))*vec4(1,.6,0,0);

}