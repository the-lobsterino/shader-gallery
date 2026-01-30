precision mediump float;
 uniform vec2  mouse;       // mouse
 uniform float time;       // time
 uniform vec2  resolution;       // resolution
 uniform sampler2D smp; // prev scene

const vec3  Tanziro = vec3(0.009
			   ,0.768,0.650);	//市松模様の色

//市松模様を描く
 float pCheckers(vec2 p,float n){
	 vec2 q=p*n;
	 return mod(floor(q.x)+floor(q.y),2.0);
 }

 void main(void){
    vec2 p = (gl_FragCoord.xy * 2.0 - resolution) /max(resolution.x,resolution.y);//正規化
	 p += 0.1 / 1.0 * time;	//模様の移動
	 vec3 testcolor = vec3(1.0);
    float l = pCheckers(p,10.0);
	
    gl_FragColor = vec4(vec3(Tanziro*l), 1.0);
 }