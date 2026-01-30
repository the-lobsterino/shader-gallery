#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


// 球の中心 
vec3 originSphere = vec3(0.0, 0.0, 0.0);


void main( void ) {

	vec3 lightDir = normalize(vec3(0.0,0.0, -1.0));
	vec2 pos = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);
	vec3 col = vec3(0.0); //initialize in black
	
	// カメラの位置
	vec3 cameraPos = vec3(0.0, 0.0, 5.0);
	vec3 ray = normalize(vec3(pos, 0.0) - cameraPos);
	vec3 currentPos = cameraPos;
	vec2 mouseNorm = mouse * 2.0 - 1.0;
	float size = 0.5;	
	
	// 球の描画
	vec3 d = ray;
	vec3 o = cameraPos;
	vec3 c = originSphere;
	float r = size;
	
	float a0 = dot(d,d);
	float b0 = 2.0*dot(d, o-c);
	float c0 = dot(o-c, o-c) - r*r;
	
	float b2_4ac=b0*b0-4.0*a0*c0;
	float eps=0.0001;
	float diff = 0.0;
	float t = 100000000.0;
	// 交差があるときのみ、描画できる可能性がある
	if (b2_4ac >eps){
		float t_p = (-b0+sqrt(b2_4ac))/(2.0*a0);
		float t_n = (-b0-sqrt(b2_4ac))/(2.0*a0);
		// もし、球がカメラの後ろ側、カメラが球の中にあるときは描画しない。
		if (t_p>0.0 && t_n>0.0){
			t = min(t_p, t_n);
			vec3 p = o+t*d;
			vec3 n = (p-c)/r;			
			// 反射によってシェーディングを変える
			diff = dot(n, lightDir);
			col = vec3(-diff) + vec3(0.1);
			
		}
	}
	
	// 平面の描画
	// 平面のとおる座標
	vec3 plane_origin = vec3(0.3, 0.0, 0.0);
	// 平面の法線ベクトル
	vec3 plane_n = vec3(1.0, 0.0, 0.0);
	
	float n_plane_origin = (plane_n*plane_origin)[0] +(plane_n*plane_origin)[1]+(plane_n*plane_origin)[2] ;
	float n_o                   = (plane_n*o)[0] +(plane_n*o)[1]+(plane_n*o)[2] ; 
	float n_d                  = (plane_n*d)[0] +(plane_n*d)[1]+(plane_n*d)[2] ;
	float t_d = (n_plane_origin-n_o)/n_d;
	

	float n_n                  = (plane_n*(-plane_n))[0] +(plane_n*(-plane_n))[1]+(plane_n*(-plane_n))[2] ;
	float t_n = (n_plane_origin-n_o)/n_n;
	// カメラよりも後ろにある部分（半平面）、かつ球面の後ろにある平面は描画しないようにする。
	// 平面はy=-1~1, z=-1~1をとるとする。
	vec3 plane_p = o+t_d*d;
	if (t_d>0.0 && t>t_d && -1.0<plane_p[1] && plane_p[1]<1.0 && -1.0<plane_p[2] && plane_p[2]<1.0){
		// 今回のシェーディングは、平面とlightDirとの内積が画面内では常に大きいので、白く見えると考察する。
		vec3 n_p = (d*t_d-2.0*t_n*plane_n);
		diff = dot(n_p, lightDir)/length(n_p);
		if (diff>0.0){
			/* 
			反射する角度と光の向きの内積が正の場合、直接的な反射光がないので、ambient光を示す。
			ambient光の強さは、カメラと交点との距離に依存するのが適当だと考えた。
			
			*/
			// 
			col = (4.0/t_d)*vec3(1.0);
		}
		else{
			
			col = vec3(diff) + vec3(1.0);	
		}
	}
	
	
	
	

	gl_FragColor = vec4( col, 1.0); 
	/*
	中央にある球を上からライトを当てているところを、同じくカメラが上から見ている図。
	そして、平面はx軸に直行するようなもので、球と交差するものにしている。
	そして、交差判定を実装したところ、
	中央に球面、みぎに半平面が見えるため、確かに交差判定ができている。
	また平面より奥にある球の部分は隠れているため、球と平面同士の交差も判定できている。
	*/
}