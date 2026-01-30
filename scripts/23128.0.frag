         #ifdef GL_ES
         precision mediump float;
         #endif

         uniform float time;
         uniform vec2 mouse;
         uniform vec2 resolution;
varying vec2 surfacePosition;
#define R surfacePosition
#define time time/3. + length(R-mouse/1.)

#define ITE_MAX      80
#define DIST_COEFF   1.00
#define DIST_MIN     0.01
#define DIST_MAX     1000.0

#define ID_NONE      0.0
#define ID_TABLE     1.0
#define ID_GETA      2.0
#define ID_SHARI     3.0

#define ID_NETA1     4.0  //egg
#define ID_NETA2     5.0  //nori 

#define ID_MAGURO    6.0  //MAGURO

vec2 rot(vec2 p, float a) {
	return vec2(
		p.x * cos(a) - p.y * sin(a), 
		p.x * sin(a) + p.y * cos(a));
		
}

float box(vec3 pos, vec3 scale, float r) {
	return length(max(abs(pos) - scale , 0.0)) - r;
}

float rnd(vec2 p){
    return fract(sin(dot(p ,vec2(12.9898,78.233))) * 43758.5453);
}


	void geta(vec3 p, out float id, out float t) {

	//p.xz = rot(p.xz, time);
	 float w  = DIST_MAX;
	 vec3 tp  = p;
	 vec3 mp  = p;

	 t = 0.1 + dot(p, vec3(0, 1, 0));
	 id = ID_TABLE;

	//GETA
	mp.y += 0.0;
	tp = mp + vec3(0, 0, 0);
	w = box(tp, vec3(0.5, 0.01, 0.2), 0.001);
	if(w < t) id = ID_GETA;
	t = min(t, w);

	tp = mp + vec3(0.3, 0.1, 0);
	w = box(tp, vec3(0.07, 0.1, 0.2), 0.001);
	if(w < t) id = ID_GETA;
	t = min(t, w);
	tp = mp + vec3(-0.3, 0.1, 0);
	w = box(tp, vec3(0.07, 0.1, 0.2), 0.001);
	if(w < t) id = ID_GETA;
	t = min(t, w);

		
	//SHARI
	tp = mp + vec3(-0.2, -0.04, 0);
	w = length(max(abs(tp) - vec3(0.04, 0.005, 0.02) * 1.6 , 0.0)) - 0.05;
	if(w < t) id = ID_SHARI;
	t = min(t, w);

	
	tp = mp + vec3(0.2, -0.04, 0);
	w = length(max(abs(tp) - vec3(0.04, 0.005, 0.02) * 1.6 , 0.0)) - 0.05;
	if(w < t) id = ID_SHARI;
	t = min(t, w);	

	//ID_NETA1
	tp = mp + vec3(0.2, -0.07, 0);
	w = length(max(abs(tp) - vec3(0.06, 0.007, 0.01) * 1.6 , 0.0)) - 0.05;
	if(w < t) id = ID_NETA1;
	t = min(t, w);


	//ID_NETA2( NORI )
	tp = mp + vec3(0.2, -0.07, 0);
	w = length(max(abs(tp) - vec3(0.006, 0.04, 0.05) * 1.6 , 0.0)) - 0.006;
	if(w < t) id = ID_NETA2;
	t = min(t, w);

	//ID_MAGURO
	tp = mp + vec3(-0.2, -0.07, 0);
	w = length(max(abs(tp) - vec3(0.06, 0.007, 0.01) * 1.6 , 0.0)) - 0.05;
	if(w < t) id = ID_MAGURO;
	t = min(t, w);		
}


vec4 gentex(vec3 ip, float id) {
	//if(id == ID_TABLE) return vec4(4,3,2,1) * 0.4;
	if(id == ID_GETA)   return vec4(rnd(ip.yy * 0.0002)) * vec4(4,3,2,1) * 0.6;
	if(id == ID_NETA1)  return vec4(0,1,6,0);
	if(id == ID_NETA2)  return vec4(0,0,0,0);
	//if(id == ID_MAGURO) return vec4(rnd(ip.xy * 0.000001)) * vec4(3,0.1,0,0);
	if(id == ID_MAGURO) return vec4(4,0.1,0,0);
	return vec4(1.0);
}

         //形状を記述していきます
         //参考 : http://www.iquilezles.org/www/articles/distfunctions/distfunctions.htm
         float map(vec3 p, out float id) {
		float t  = DIST_MAX;
		 //p = mod(p, 1.4) - 0.7;
		 p.xz = mod(p.xz, 1.4) - 0.7;
		geta(p, id, t);
		return t;
	}

         void main( void ) {
		 float flash = 1.0 - fract(time * 2.0);

         	//-1 ～ +1のテクスチャUVを作る
         	vec2 uv = ( gl_FragCoord.xy / resolution.xy ) * 2.0 - 1.0;
		 if(abs(uv.y) > 0.75) discard;
         	
         	//視点ベクトルを作成する。
         	float aspect = resolution.x / resolution.y;
         	vec3  dir = normalize(vec3(uv * vec2(aspect, 1.0), 1.0));
		 dir.yz = rot(dir.yz, 0.7);
         	
         	//eye座標
         	vec3 pos = vec3(time  * 2.0, 2.0 + sin(time * 3.0) * 1.0, 0.4);
         	
	float t      = 0.;//rnd(vec2(dir.x + time, dir.y * 6.0)) * 0.5;
	float id     = ID_NONE;
	for(int i = 0 ; i < ITE_MAX; i++) {
		float ttemp = map(t * dir + pos, id);
		if(ttemp < DIST_MIN) break;
		t += ttemp * DIST_COEFF;
	}

         	
         	//option形状の近くの位置を出しておく
         	vec3 ip = pos + dir * t;
         	
         	//色を作ります。ここでは進めたtの位置(深度)をただ出力するだけ
         	vec3 color = gentex(ip, id).xyz * map(ip + 0.1, id) + t * 0.01;
		  color += flash;
		 
		 color *= 1. - dot(uv, uv);
         	
         	//最後に色をつけておしまいです
         	gl_FragColor = vec4(color, 1.0);
	 }
