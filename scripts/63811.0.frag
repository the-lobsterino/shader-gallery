#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float distanceFunction(vec3 pos){
  float d=length(pos)-0.5;
  return d;
}

float sdSphere(vec3 p,float r){
	float d=length(p)-r;
	return d;
}

float sdPlane(vec3 p){
	float d=p.y;
	return d;
}

float sdBoxY(vec3 p,float s){
	return p.y;
}

float sdBoxX(vec3 p,float s){
	return p.x;
}

float sdBox(vec3 p, float s) {
    return max(max(p.x, p.y), p.z);
}


void main(){
	
	//スクリーン座標を-1から1にしたもの
	vec2 screenPos=(gl_FragCoord.xy*2.0-resolution.xy)/min(resolution.x,resolution.y);
	
	//バーチャルカメラの存在座標
  	vec3 cameraPos=vec3(0,0,-5);
	
	//カメラからスクリーンまでの距離
  	float screenZ=5.;
	
	//カメラからスクリーンまでの方向、正規化済み
	//距離が変わっても方向は正規化されているので、視野角が変わるという概念
 	vec3 rayDirection=normalize(vec3(screenPos,screenZ));  
	
	//カメラからそのピクセルに向かってどれだけ進んだかの深さ
  	float depth=0.0;
	
	//最終的に塗る色の宣言
	vec3 col=vec3(0.5);
	
	//1ピクセルに対して60回ループ、60回rayを前進させる
	//rayのスタート地点は
	//カメラ座標+ピクセル方向にどれだけ進んだかの深さ
	//ray座標から球体に当たり判定？を広げて距離を測る
	//スクリーンまでの距離が0.1未満だったらそのピクセルを白とする
	for(int i=0;i<60;i++){
		vec3 rayPos=cameraPos+rayDirection*depth;
		float dist=distanceFunction(rayPos);
		
		
		if(dist<0.1){
			col=vec3(1);
			break;
		}
		
		depth+=dist;
	}
	
	
	
	
	

	
	
  
  	
  
  	gl_FragColor=vec4(col,1);
}