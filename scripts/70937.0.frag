precision mediump float;
uniform vec2 iResolution;
uniform float iTime;

// --------[ Original ShaderToy begins here ]---------- //


const vec3 lightDir=vec3(-0.57,0.57,0.57);//光源の位置


//立方体の距離関数
float distFuncCube(vec3 p){
	vec3 q=abs(p);
	return length(max(q-vec3(1.0,0.1,0.5),0.0));
}
//球の距離関数
float distFuncSphere(vec3 p){
	float s=0.5;
	return length(p)-s;
}

//2つのオブジェクトを描画
float distFunc(vec3 p){
	p=mod(p,0.8)-0.4;
	float d3=distFuncCube(p);
	float d4=distFuncSphere(p);

	return min(d3,d4);//OR

	//return max(d3,d4);//AND

	//return max(d3,-d4);
	
	//return max(-d3,d4);

}

//法線を導出
vec3 genNormal(vec3 p){
	float d=0.0001;
	return normalize(vec3(
		distFunc(p+vec3(d,0.0,0.0))-distFunc(p+vec3(-d,0.0,0.0)),
		distFunc(p+vec3(0.0,d,0.0))-distFunc(p+vec3(0.0,-d,0.0)),
		distFunc(p+vec3(0.0,0.0,d))-distFunc(p+vec3(0.0,0.0,-d))
		));
}


void mainImage(out vec4 fragColor,in vec2 fragCoord){
	vec2 p=(2.0*fragCoord.xy-iResolution)/min(iResolution.x,iResolution.y);


	vec3 cPos=vec3(sin(iTime)*0.6,0.5,iTime*0.3);
	vec3 cDir=vec3(0.0,0.0,-1.0);//カメラの向き（スクリーン奥を見ている）
	vec3 cUp=vec3(0.0,1.0,0.0);//カメラの上方向(上向き)
	vec3 cSide=cross(cDir,cUp);//カメラの横方向
	float targetDepth=1.0;

	vec3 ray=normalize(cSide*p.x+cUp*p.y+cDir*targetDepth);

	float tmp,dist;
	tmp=0.0;
	vec3 dPos=cPos;//レイの原点

	float emission=0.0;

	for(int i=0;i<48;i++){
		dist=distFunc(dPos);
		tmp+=dist;
		dPos=cPos+tmp*ray;
		emission+=exp(abs(dist)*-0.2);
	}

	vec3 color;

	if(abs(dist)<0.001){
		vec3 normal=genNormal(dPos);
		float diff=clamp(dot(lightDir,normal),0.1,1.0);
		color=0.02*emission*vec3(sin(iTime),1.0,cos(iTime))*diff;
	}else{
		color=vec3(0.0);
	}
	fragColor=vec4(color,1.0);
}

// --------[ Original ShaderToy ends here ]---------- //
void main(void){
	mainImage(gl_FragColor,gl_FragCoord.xy);
}
