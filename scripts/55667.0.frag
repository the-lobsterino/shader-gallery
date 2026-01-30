#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const float epsilon = 0.0001;

const float cameraZ = -5.0;// カメラのZ座標
const float screenDist = 1.0;// カメラからスクリーンまでの距離
const float moveScale = 5.0;// マウス移動のスケール

// 配列が作れないので仕方なく

const vec3 ballPosition1 = vec3(1.5, -3.0, 3.0);// 球の位置
const vec3 ballPosition2 = vec3(-4.0, -1.0, 5.0);// 球の位置
const vec3 ballPosition3 = vec3(0.5, 1.0, 9.0);// 球の位置
const vec3 ballPosition4 = vec3(0.0, -23.0, 10.0);// 球の位置

const float ballSize1 = 1.0;// 球の半径
const float reflectParam1 = 0.1;// 反射光の割合
const float reflectParam2 = 0.3;// 反射光の割合
const float reflectParam3 = 0.5;// 反射光の割合
const float reflectParam4 = 0.7;// 反射光の割合

const float ballSize2 = 2.0;// 球の半径
const float ballSize3 = 4.0;// 球の半径
const float ballSize4 = 20.0;// 球の半径

const vec3 ballColor1 = vec3(0.2, 0.4, 1.0);// 球の色
const vec3 ballColor2 = vec3(1.0, 0.2, 0.2);// 球の色
const vec3 ballColor3 = vec3(0.2, 1.0, 0.2);// 球の色
const vec3 ballColor4 = vec3(0.6, 0.7, 0.2);// 球の色

float getBallIntersection(vec3 start, vec3 direction, vec3 center, float size){// 交差していたら初めにぶつかる点までの距離を返し、それ以外は負の数を返す
	vec3 p0 = center - start;// 中心
	float len = dot(direction, p0);
	vec3 p = direction * len;// 中心に最も近い点
	
	float h = length(p - p0);// 直線への距離
	if(h >= size){ return -1.0; }
	
	float d = sqrt(size * size - h * h);// 点pから交点までの距離
	float l1 = len - d;// 交点1
	float l2 = len + d;// 交点2
	
	if(l2 < 0.0){ return -1.0; }
	if(l1 > 0.0){
		return l1 - epsilon;
	}
	else{
		return l2 - epsilon;
	}
	
	return 0.0;
}
vec3 getReflectDirection(vec3 v, vec3 n){
	n = normalize(n);
	float p = dot(v, n);
	v -= n * (p*2.0);
	return normalize(v);
}

void main( void ) {
	vec2 position2d = ( (gl_FragCoord.xy - resolution.xy / 2.0) / min(resolution.x, resolution.y) );
	vec3 cameraPos = vec3(mouse.x - 0.5, mouse.y - 0.5, 0.0) * moveScale + vec3(0.0, 0.0, cameraZ);// カメラの位置
	vec3 screenPos = cameraPos + vec3(position2d.x, position2d.y, screenDist);// スクリーン上の点
	vec3 sunlight = normalize(vec3(1,5,-2));// 光源の向き
	
	vec3 ray = cameraPos;
	vec3 direction = normalize(screenPos - cameraPos);
	
	vec3 color = vec3(0.0, 0.0, 0.0);
	float a = 0.0;
	
	for(int i=0;i<100;i++){
		int n = 0;
		float tmin = -1.0;
		float reflectParam = 0.0;
		float t1 = getBallIntersection(ray, direction, ballPosition1, ballSize1);
		float t2 = getBallIntersection(ray, direction, ballPosition2, ballSize2);
		float t3 = getBallIntersection(ray, direction, ballPosition3, ballSize3);
		float t4 = getBallIntersection(ray, direction, ballPosition4, ballSize4);
		
		if((tmin < 0.0 && t1 > 0.0) || (tmin > 0.0 && t1 > 0.0 && t1 < tmin)){
			tmin = t1;
			reflectParam = reflectParam1;
			n = 1;
		}
		if((tmin < 0.0 && t2 > 0.0) || (tmin > 0.0 && t2 > 0.0 && t2 < tmin)){
			tmin = t2;
			reflectParam = reflectParam2;
			n = 2;
		}
		if((tmin < 0.0 && t3 > 0.0) || (tmin > 0.0 && t3 > 0.0 && t3 < tmin)){
			tmin = t3;
			reflectParam = reflectParam3;
			n = 3;
		}
		if((tmin < 0.0 && t4 > 0.0) || (tmin > 0.0 && t4 > 0.0 && t4 < tmin)){
			tmin = t4;
			reflectParam = reflectParam4;
			n = 4;
		}
		
		if(n == 0){ break; }
		
		float t = tmin;
		vec3 c;
		vec3 ballPos;
		
		if(n == 1){
			c = ballColor1;
			ballPos = ballPosition1;
		}
		if(n == 2){
			c = ballColor2;
			ballPos = ballPosition2;
		}
		if(n == 3){
			c = ballColor3;
			ballPos = ballPosition3;
		}
		if(n == 4){
			c = ballColor4;
			ballPos = ballPosition4;
		}
		
		float b = (1.0 - a) * (1.0 - reflectParam);
		a += b;
		color += c * b;
		
		ray += direction * t;
		direction = getReflectDirection(direction, ray - ballPos);
	}
	
	
	float c = dot(direction, sunlight);
	if(c > 0.0){ c = pow(c, 2.0) * 1.0 + 0.2; }
	else{
		c = 0.2;
	}
	color += vec3(1.0, 1.0, 1.0) * c * (1.0-a);

	gl_FragColor = vec4( color, 1.0 );

}