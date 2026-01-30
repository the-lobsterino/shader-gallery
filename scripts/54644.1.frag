#ifdef GL_ES
precision mediump float;
#endif

uniform float time;	//t
uniform vec2 n;	//mouse
uniform vec2 resolution;	//r
float X;	//移動座標x

#define PI 3.1415926535897932384626433832795


void main( void ) {
	
	vec2 pos = vec2(gl_FragCoord.x/resolution.x, gl_FragCoord.y/resolution.y);	//x,y座標
	X = abs(sin(time * 0.3)) + 0.1;	//x座標をTimeで移動
	pos = vec2(X, 0.5) - pos;	// 左、真ん中
	
	float r = length(pos)*7.0; //パックマンの大きさ指定
	float a = atan(pos.y, pos.x); //位置を受けた角度
	
	a = a + 180.*PI/180.0;	//口の動く範囲
	float angle = 60.0 * (cos(time*20.0) + 1.0)/2.0;	//口の開く角度、tと合わせることによってパクパク
	
	/* 描画 */
	vec3 color = vec3(1.0 - step(0.4, r));
	color *= step(angle, a*180./PI);
	color *= vec3(1.0, 1.0, 0.0);
	gl_FragColor = vec4(color, 1.0);

}

