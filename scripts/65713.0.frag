#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

//Special thanks
//三谷先生 @jmitani
//https://twitter.com/jmitani/status/1253137193373061123
//https://github.com/jun-mitani/menger-sponge/blob/master/README.md
 
//■HSV変換
vec3 hsv(float h, float s, float v) {
	vec4 t = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
	vec3 p = abs(fract(vec3(h) + t.xyz) * 6.0 - vec3(t.w));
	return v * mix(vec3(t.x), clamp(p - vec3(t.x), 0.0, 1.0), s);
}

//■キューブ生成
float sdBox(vec3 p, vec3 b)
{
	vec3 q = abs(p) - b;
	return length(max(q, 0.0)) + min(max(q.x, max(q.y, q.z)), 0.0);
}

//■フラクタル（メンガーのスポンジ）生成
float DE(vec3 p)
{
	//レイの先端：p

	float d = sdBox(p, vec3(1.0));

	float s = 3.00; 
	for (int m = 0; m < 6; m++)
	{
		vec3 a = mod(p * s, 2.0) - 1.0;
		s *= 3.0;
		vec3 r = abs(1.0 - 3.0 * abs(a));
		float da = max(r.x, r.y); 
		float db = max(r.y, r.z); 
		float dc = max(r.z, r.x);
		float c = (min(da, min(db, dc)) - 1.0) / s;
		d = max(d, c);
	}

	return d;
}

//■描画オブジェクト設定
float map(in vec3 rayP)
{
	//レイの先端：rayP

	float Scale = 50.0; //スケール調整
	return DE(rayP / Scale)*Scale;

}

//■レイから図形を描画する（marching loopをする）
vec2 interesct(in vec3 ro, in vec3 rd, in float tmax)
{
	float t = 0.0;
	float i = 0.0;
	for (float i = 0.0; i < 128.0; i++)
	{
		//レイの先端位置を計算
		vec3 rayP = ro + t * rd;

		//図形設定
		float d = map(rayP);

		if (d<(0.0001*t) || t>tmax) return vec2(t, i);
		t += d;
	}

	return vec2(t, i);
}

//■法線の算出
vec3 calcNormal(vec3 p) {
	float e = 0.0001;
	return normalize(vec3(
		map(vec3(p.x + e, p.y, p.z)) - map(vec3(p.x - e, p.y, p.z)),
		map(vec3(p.x, p.y + e, p.z)) - map(vec3(p.x, p.y - e, p.z)),
		map(vec3(p.x, p.y, p.z + e)) - map(vec3(p.x, p.y, p.z - e))
	));
}

//■図形描画メイン処理
vec3 render(in vec3 ro, in vec3 rd)
{
	//ro：カメラの位置
	//rd：レイの先端

	float colorInvert = 0.0; 
	
	vec3 light = -normalize(rd);

	float tmax = 1024.0;

	vec3 col;

	//rayから図形を描画する
	vec2 rayData = interesct(ro, rd, tmax);
	float t = rayData.x;

	//色設定
	vec3 skyColor = vec3(0.1);
	vec3 solidColor = hsv(0.52, 0.24, 1.0);

	if (t > tmax)
	{
		//1024.0より大きい場合、描画無し
		col = skyColor;
	}
	else
	{
		//1024.0以下の場合、描画

		//描画の後処理

		vec3 rayP = ro + t * rd;
		vec3 nor = calcNormal(rayP);

		float distOcclusion = 1.0 - rayData.y * 2.0 / 256.0;
		float diffLighting = clamp(dot(light, nor), 0.0, 1.0);

		float specLighting = colorInvert + pow(clamp(dot(nor, normalize(light - rd)), 0.0, 1.0), 32.0);

		float combinedShading = diffLighting * 0.35 + distOcclusion * 0.4 + specLighting * 0.15 + 0.1;

		col = solidColor * combinedShading;

		float fogStrength = exp(-t * 0.01);
		col = skyColor * (1.0 - fogStrength) + col * fogStrength;

	}

	col = vec3(colorInvert) + col;
	col = vec3(col.x*col.x, col.y*col.y, col.z*col.z);

	return col;
}

//■メイン処理
void main(void)
{
	
	// スクリーン座標をフラグメントシェーダー用に変換
	vec2 ScreenPos = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);

	//■カメラ設定
	float xDir = sin(time * 0.37) * 0.54;
	float yDir = cos(time * 0.37) * 0.54;

	float screenTime = mod(time, 64.0);

	float moveSpeed;

	vec3 cPos; //位置

	if (screenTime < 13.0) {
		moveSpeed = 8.0;
		cPos = vec3(0.0, 0.0, 154.0 - screenTime * moveSpeed);
	}
	else {
		moveSpeed = 2.0;
		cPos = vec3(0.0, 0.0, 61.0 + (moveSpeed + 13.0) - screenTime * moveSpeed);
	}

	vec3 cDir = vec3(xDir, yDir, -1.0); //カメラの向き
	vec3 cUp = vec3(0, 1.0, 0); //上方向
	vec3 cSide = cross(cDir, cUp); //横方向

	vec3 ro = cPos;

	//■rayの設定
	vec3 rd = normalize(cDir + cSide * ScreenPos.x + cUp * -ScreenPos.y);

	//■rayから図形を算出
	vec3 col = render(ro, rd);

	//■算出結果を表示
	gl_FragColor = vec4(col, 1.0);
}