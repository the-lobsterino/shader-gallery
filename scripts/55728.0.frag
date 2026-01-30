#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const float PI = 3.14159265;
const float PI2 = PI*2.;

const float angle = 60.0;
const float fov = angle * 0.5 * PI / 180.0;

const float sphereSize = 0.4;
const vec3 lightDir = vec3(-1.02, 0.57, -0.6);



//
vec3 trans(vec3 p){
	return mod(p, 2.4)-1.2;
}


float distFnc(vec3 p){
 return length(trans(p)) - sphereSize;
}


vec3 getNormal(vec3 p){
	float step = 0.0001;
	return normalize(vec3(
		distFnc(p + vec3(step, 0., 0.)) - distFnc(p + vec3(-step, 0., 0.)),
		distFnc(p + vec3(0., step, 0.)) - distFnc(p + vec3(0., -step, 0.)),
		distFnc(p + vec3(0., 0., step)) - distFnc(p + vec3(0., 0., -step))
	));
}

//pmodで回転行列を生成
mat2 rot(float a) {
    float c = cos(a);
    float s = sin(a);
    return mat2(c,s,s,c);
}

vec2 pmod(vec2 p, float r) {
    float a =  atan(p.x, p.y) + PI/r;
    float n = PI2 / r;
    a = floor(a/n)*n;
    return p*rot(-a);
}

void main( void ) {
	vec2 p = vec2(gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);

	//カメラ位置の定義
	vec3 CamPos = vec3(0, 0, -2.);

	//スクリーンの定義、レイの定義
	float screenZ = 2.;
	vec3 rayD = normalize(vec3(p, screenZ));
	

	//レイの進度と色の初期化
	float depth = 0.;
	vec3 col = vec3(0.);

	//マーチングループ
	for(int i = 0; i < 99;i++){
	vec3 rayPos = CamPos + rayD * depth;
	float dist = distFnc(rayPos);

		if(dist < 0.001){
	//法線の活用
      vec3 normal = getNormal(rayPos);
      float diff = clamp(dot(lightDir, normal), 0.1, 1.0);
			col = vec3(diff);
			break;
		}
		depth += dist;
	}
		
	gl_FragColor = vec4(col, 1.0);

}
