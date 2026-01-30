#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void DrawEllipseSectorFill(vec2, vec2);
void DrawEllipseSectorFrame(vec2, vec2);
vec2 vecCatesianToPolar(vec2);


const float pi = 3.141592;
void main( void ) {
	//DrawEllipseSectorFill(vec2(30.0, 330.0), vec2(100.0, 30.0));
	DrawEllipseSectorFrame(vec2(30.0, 330.0), vec2(100.0, 30.0));
}

void DrawEllipseSectorFill(vec2 vecDegRange, vec2 vecAxis)	// degMin, degMax, Rx, Ry
{
	float rMax = max(vecAxis.x, vecAxis.y);
	vec2 vecStretchParam = vecAxis / vec2(rMax, rMax);		//引き伸ばしパラメータ
	vec2 vecScreenCenter = resolution.xy / vec2(2.0, 2.0);		//画面中央
	vec2 vecPoint = gl_FragCoord.xy - vecScreenCenter;		//画面中央から現在の点までのベクトル
	vec2 vecPointStretched = vecPoint / vecStretchParam;		//円形に引き伸ばし後のベクトル
	vec2 vecPolar = vecCatesianToPolar(vecPointStretched);		//円ベクトルを極座標に変換
	
	if(vecPolar.x < rMax) {
		if(vecDegRange.x <= degrees(vecPolar.y) &&
		   degrees(vecPolar).y <= vecDegRange.y) {
			gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
		}
	}
}

void DrawEllipseSectorFrame(vec2 vecDegRange, vec2 vecAxis)
{
	float rMax = max(vecAxis.x, vecAxis.y);
	vec2 vecStretchParam = vecAxis / vec2(rMax, rMax);
	vec2 vecScreenCenter = resolution.xy / vec2(2.0, 2.0);
	vec2 vecPoint = gl_FragCoord.xy - vecScreenCenter;
	vec2 vecPointStretched = vecPoint / vecStretchParam;
	vec2 vecPolar = vecCatesianToPolar(vecPointStretched);
	
	//堕円弧の描画
	if(vecPolar.x <= rMax && vecPolar.x >= rMax - 5.0) {
		if(vecDegRange.x <= degrees(vecPolar.y) &&
		   degrees(vecPolar).y <= vecDegRange.y) {
			gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
		}
	}
}

vec2 vecCatesianToPolar(vec2 vecCatesian)
{
	float theta = atan(vecCatesian.y / vecCatesian.x);
	if (vecCatesian.x < 0.0 && vecCatesian.y > 0.0) {
		theta = pi + theta;
	} else if(vecCatesian.x < 0.0 && vecCatesian.y < 0.0) {
		theta += pi;
	} else if (vecCatesian.x >= 0.0 && vecCatesian.y < 0.0) {
		theta = 2.0 * pi + theta;
	}
	
	float r = sqrt(dot(vecCatesian, vecCatesian));
	return vec2(r, theta);
}