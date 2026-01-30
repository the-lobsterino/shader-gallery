#extension GL_OES_standard_derivatives : enable

precision mediump float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D backbuffer;
vec4 blank = vec4(0.);
vec4 sand = vec4(.76, .69, .50, 1.);
vec4 red = vec4(1, 0, 0, 1);

float getDist(vec2 p1, vec2 p2) {
	float dy = p2.y - p1.y;
	float dx = p2.x - p1.x;
	return sqrt(dy * dy + dx * dx);
}

bool lte(float v, vec2 u) {
	if (v < u.x && v < u.y) {
		return true;	
	}
	return false;
}

float rand(vec2 co){
	return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
}

bool randFallLeft(vec2 pos) {
	return rand(pos + .1 + time) < .01;
}

bool randFallRight(vec2 pos) {
	return rand(pos - .1 + time) < .01;
}

void main( void ) {
	vec2 pos = ( gl_FragCoord.xy / resolution.xy );
	vec2 unit = 1. / resolution.xy;
	vec2 halfUnit = unit / 2.;
	
	// spawn sand at mouse
	//vec2 distFromMouse = abs(pos - mouse.xy); 
	vec2 distFromMouse = abs(pos - vec2(.51, .51));
	bool isMousePixel = lessThan(distFromMouse, halfUnit) == bvec2(true, true);
	vec4 color = texture2D(backbuffer, pos);
	if (isMousePixel && color == blank) {
		gl_FragColor = sand;
		return;
	}
	
	// drop sand
	vec2 pixelY = vec2(0., unit.y);
	vec2 pixelX = vec2(unit.x, 0.);
	vec2 posUp = pos + pixelY;
	vec2 posDown = pos - pixelY;
	vec2 posRight = pos + pixelX;
	vec2 posLeft = pos - pixelX;
	vec2 posUpRight = pos + pixelY + pixelX;
	vec2 posUpLeft = pos + pixelY - pixelX;
	vec2 posDownRight = pos - pixelY + pixelX;
	vec2 posDownLeft = pos - pixelY - pixelX;
	vec4 colorUp = texture2D(backbuffer, posUp);
	vec4 colorDown = texture2D(backbuffer, posDown);
	vec4 colorRight = texture2D(backbuffer, posRight);
	vec4 colorLeft = texture2D(backbuffer, posLeft);
	vec4 colorUpRight = texture2D(backbuffer, posUpRight);
	vec4 colorUpLeft = texture2D(backbuffer, posUpLeft);
	vec4 colorDownRight = texture2D(backbuffer, posDownRight);
	vec4 colorDownLeft = texture2D(backbuffer, posDownLeft);
	bool isBottomPixel = pos.y == halfUnit.y;
	if (isBottomPixel) {
		if (color == blank && colorUp != blank) {
			gl_FragColor = colorUp;	
			return;
		}
		gl_FragColor = color;	
		return;
		
	} else {
		// is blank
		if (color == blank) {
			if (colorUpLeft != blank && colorLeft != blank && colorUp == blank && randFallRight(posUpLeft)) {
				gl_FragColor = colorUpLeft;
			} else if (colorUpRight != blank && colorRight != blank && colorUp == blank && randFallLeft(posUpRight)) {
				gl_FragColor = colorUpRight;
			} else if (color == blank && colorUp != blank) {
				gl_FragColor = colorUp;
			} else {
				gl_FragColor = color;
			}
		} 
		// is a material
		else {
			if (colorRight == blank && colorDownRight == blank && colorDown != blank && randFallRight(pos)) {
				gl_FragColor = blank;
			} else if (colorLeft == blank && colorDownLeft == blank && colorDown != blank && randFallLeft(pos)) {
				gl_FragColor = blank;
			} else if (color != blank && colorDown == blank) {
				gl_FragColor = blank;
			} else {
				gl_FragColor = color * .995;
			}
				
		}
		return;
	}

}