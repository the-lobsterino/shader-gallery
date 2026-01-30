#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

#define ZOOMFACTOR 1.3

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


/**
 * Club UnderWorld鯖 ロゴ
 * Author: Kory (github: Kory33, mc_id: Kory3)
 */


// 生のスクリーン座標から正規化された座標に変換する
vec2 normalizeCoordInScreen(vec2 coord, vec2 resolution) {
	vec2 position = coord / min(resolution.x, resolution.y);
	
	if(resolution.x > resolution.y){
		position -= vec2(0.5 * resolution.x / resolution.y, 0.5);
	} else {
		position -= vec2(0.5, 0.5 * resolution.y / resolution.x);
	}
	
	return position;
}

float distanceFromCircle(vec2 pos, float radius) {
	return abs(length(pos) - radius);
}

void drawDot(vec2 coord, vec2 pos, float radius) {
	if (length(pos - coord) < radius) {
		gl_FragColor = vec4(1.);
	}
}

void drawLetterC(vec2 coord, float radius, float thickness) {
	if (coord.x > 0.) {
		return;
	}
	if (abs(length(coord) - radius) < thickness) {
		gl_FragColor = vec4(1.);
	}
}

void drawLetterU(vec2 coord, float height, float radius, float thickness) {
	// カーブ部分
	if (coord.y < - height / 2. + radius) {
		vec2 circleCentre = vec2(0., - height / 2. + radius);
		if(abs(length(coord - circleCentre) - radius) < thickness) {
			gl_FragColor = vec4(1.);
		}
		return;
	}
	
	// 直線部分
	if (coord.y < height / 2. && abs(abs(coord.x) - radius) < thickness) {
		gl_FragColor = vec4(1.);
		return;
	}
}

void drawLetterW(vec2 coord, float height, float width, float thickness) {
	vec2 aliasCoord = vec2(coord);
	// y軸上で折り返す
	if (aliasCoord.x < 0.) {
		aliasCoord.x *= -1.;
	}
	
	// 右半分よりも内側の部分の処理
	if (aliasCoord.x < width) {
		// さらに半分に折り返す
		if (aliasCoord.x > width / 2.) {
			aliasCoord.x = width - aliasCoord.x;
		}
		
		// 一次関数からのyの違いがthickness以内であれば塗りつぶす
		if(abs(aliasCoord.y - (aliasCoord.x * (thickness - height) / (width / 2.) + (height - thickness) / 2.)) < thickness / 2.) {
			gl_FragColor = vec4(1.);
		}
		return;
	}
	
	// 残りの端の部分

	// 三角形を原点に合わせる
	aliasCoord -= vec2(width, (height / 2.) - thickness);
	
	float triHeight = thickness;
	float triWidth = triHeight / ((height - thickness) / (width / 2.));
	
	if(aliasCoord.x > triWidth || aliasCoord.y > triHeight || aliasCoord.y / aliasCoord.x < triHeight / triWidth) {
		return;
	}
	
	gl_FragColor = vec4(1.);
	
	return;
}

void main( void ) {
	vec2 position = normalizeCoordInScreen(gl_FragCoord.xy, resolution) / ZOOMFACTOR;
	
	gl_FragColor = vec4(1.);
	
	// 外円の処理
	if(length(position) < .3) {
		gl_FragColor -= vec4(vec3(0.85), 1.);
	}
	
	// 内円（灰色）の処理
	if(length(position - vec2(.1, 0.)) < 0.2) {
		gl_FragColor += vec4(vec3(0.2), 1.);
	}
	
	// 中心の空洞の処理
	if(length(position - vec2(.15, 0.)) < 0.15) {
		gl_FragColor = vec4(1.);
	}
	
	// 文字描画
	drawLetterC(position + vec2(.215, 0.), 0.06, 0.004);
	drawDot(position, vec2(-0.195, -0.06), 0.0055);
	drawLetterU(position + vec2(.145, -0.001), 0.126, 0.018, 0.004);
	drawDot(position, vec2(-0.095, -0.06), 0.0055);
	drawLetterW(position + vec2(.045, 0.), 0.128, 0.035, 0.0385);
}