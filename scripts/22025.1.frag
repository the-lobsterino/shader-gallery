#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec4 white = vec4(1, 1, 1, 1);
vec4 black = vec4(0, 0, 0, 1);
vec4 sky1  = vec4(.6, 0, 1, 1);
vec4 sky2  = vec4(0, .6, 1, 1);
vec4 text1 = vec4(1, .6, .6, 1);
vec4 text2 = vec4(1, 1, .6, 1);

// y軸周りの回転行列
mat3 Ry(float t) {
	return mat3(cos(t), 0, sin(t), 0, 1, 0, -sin(t), 0, cos(t));
}

// yコーディネート振幅
float swing(float y, int n) {
	return y + cos(float(n) * 0.6 + time * 4.0) * 0.7;
}

bool texture(vec2 p, float ox, float oy) {
	float x = (p.x * 140.) - 4. - ox;
	float y = (p.y * -58.) + 26. - oy;
	return ((x >= 2.0 && x < 4.0 && y >= swing(2.0, 0) && y < swing(3.0, 0))
	     || (x >= 4.0 && x < 5.0 && y >= swing(3.0, 1) && y < swing(4.0, 1))
	     || (x >= 0.0 && x < 2.0 && y >= swing(5.0, 2) && y < swing(6.0, 2))
	     || (x >= 2.0 && x < 3.0 && y >= swing(6.0, 3) && y < swing(7.0, 3))
	     || (x >= 1.0 && x < 4.0 && y >= swing(13.0, 4) && y < swing(14.0, 4))
	     || (x >= 4.0 && x < 6.0 && y >= swing(12.0, 5) && y < swing(13.0, 5))
	     || (x >= 6.0 && x < 7.0 && y >= swing(11.0, 6) && y < swing(12.0, 6))
	     || (x >= 7.0 && x < 8.0 && y >= swing(10.0, 7) && y < swing(11.0, 7))
	     || (x >= 8.0 && x < 9.0 && y >= swing(9.0, 8) && y < swing(10.0, 8))
	     || (x >= 9.0 && x < 10.0 && y >= swing(8.0, 9) && y < swing(9.0, 9))
	     || (x >= 10.0 && x < 11.0 && y >= swing(6.0, 10) && y < swing(8.0, 10))
	     || (x >= 11.0 && x < 12.0 && y >= swing(4.0, 11) && y < swing(6.0, 11))
	     || (x >= 16.0 && x < 17.0 && y >= swing(6.0, 12) && y < swing(7.0, 12))
	     || (x >= 17.0 && x < 29.0 && y >= swing(7.0, 13) && y < swing(8.0, 13))
	     || (x >= 33.0 && x < 39.0 && y >= swing(3.0, 14) && y < swing(4.0, 14))
	     || (x >= 39.0 && x < 42.0 && y >= swing(2.0, 15) && y < swing(3.0, 15))
	     || (x >= 42.0 && x < 43.0 && y >= swing(1.0, 16) && y < swing(2.0, 16))
	     || (x >= 38.0 && x < 39.0 && y >= swing(4.0, 17) && y < swing(11.0, 17))
	     || (x >= 32.0 && x < 45.0 && y >= swing(7.0, 18) && y < swing(8.0, 18))
	     || (x >= 37.0 && x < 38.0 && y >= swing(11.0, 19) && y < swing(13.0, 19))
	     || (x >= 36.0 && x < 37.0 && y >= swing(13.0, 20) && y < swing(14.0, 20))
	     || (x >= 34.0 && x < 36.0 && y >= swing(14.0, 21) && y < swing(15.0, 21))
	     || (x >= 51.0 && x < 58.0 && y >= swing(6.0, 22) && y < swing(7.0, 22))
	     || (x >= 54.0 && x < 55.0 && y >= swing(7.0, 23) && y < swing(12.0, 23))
	     || (x >= 50.0 && x < 59.0 && y >= swing(12.0, 24) && y < swing(13.0, 24))
	     || (x >= 65.0 && x < 67.0 && y >= swing(2.0, 25) && y < swing(3.0, 25))
	     || (x >= 67.0 && x < 68.0 && y >= swing(3.0, 26) && y < swing(4.0, 26))
	     || (x >= 66.0 && x < 69.0 && y >= swing(13.0, 27) && y < swing(14.0, 27))
	     || (x >= 69.0 && x < 71.0 && y >= swing(12.0, 28) && y < swing(13.0, 28))
	     || (x >= 71.0 && x < 72.0 && y >= swing(11.0, 29) && y < swing(12.0, 29))
	     || (x >= 72.0 && x < 73.0 && y >= swing(10.0, 30) && y < swing(11.0, 30))
	     || (x >= 73.0 && x < 74.0 && y >= swing(9.0, 31) && y < swing(10.0, 31))
	     || (x >= 74.0 && x < 75.0 && y >= swing(8.0, 32) && y < swing(9.0, 32))
	     || (x >= 75.0 && x < 76.0 && y >= swing(6.0, 33) && y < swing(8.0, 33))
	     || (x >= 77.0 && x < 77.0 && y >= swing(4.0, 34) && y < swing(6.0, 34))
	     || (x >= 82.0 && x < 84.0 && y >= swing(2.0, 35) && y < swing(3.0, 35))
	     || (x >= 84.0 && x < 85.0 && y >= swing(3.0, 36) && y < swing(4.0, 36))
	     || (x >= 80.0 && x < 82.0 && y >= swing(5.0, 37) && y < swing(6.0, 37))
	     || (x >= 82.0 && x < 83.0 && y >= swing(6.0, 38) && y < swing(7.0, 38))
	     || (x >= 89.0 && x < 90.0 && y >= swing(0.0, 39) && y < swing(2.0, 39))
	     || (x >= 91.0 && x < 92.0 && y >= swing(0.0, 40) && y < swing(2.0, 40))
	     || (x >= 81.0 && x < 84.0 && y >= swing(13.0, 41) && y < swing(14.0, 41))
	     || (x >= 84.0 && x < 86.0 && y >= swing(12.0, 42) && y < swing(13.0, 42))
	     || (x >= 86.0 && x < 87.0 && y >= swing(11.0, 43) && y < swing(12.0, 43))
	     || (x >= 87.0 && x < 88.0 && y >= swing(10.0, 44) && y < swing(11.0, 44))
	     || (x >= 88.0 && x < 89.0 && y >= swing(9.0, 45) && y < swing(10.0, 45))
	     || (x >= 89.0 && x < 90.0 && y >= swing(8.0, 46) && y < swing(9.0, 46))
	     || (x >= 90.0 && x < 91.0 && y >= swing(6.0, 47) && y < swing(8.0, 47))
	     || (x >= 91.0 && x < 92.0 && y >= swing(4.0, 48) && y < swing(6.0, 48)));
}

void main(void) {
	// プロッfffffエリア [-1, 1]^2
	vec2 p = (gl_FragCoord.xy / resolution.xy - 0.5) * 2.0;
	
	// 背景
	if (p.y < -0.1) {
		// リノリウムＲＡＹＴＲＡＣＩＮＧ
		vec3 ray = vec3(p, 1.0);
		ray *= 2.0 / ray.y;
		ray = Ry(time * 0.1) * ray;
		ray.x += time;
		vec2 tile = mod(ray.xz, 1.0);
		bool c = (tile.x > 0.5) == (tile.y > 0.5);
		gl_FragColor = c ? white : black;
	} else {
		// 空
		bool stripe = mod(p.y + 0.1 * p.x + cos(time) / 4.0, 0.2) > 0.1;
		gl_FragColor = stripe ? sky1 : sky2;
	}
	
	bool blink = mod(time, 0.2) > 0.1;
	p.y += sin(p.x * 2.0 + time) * 0.1;
	p.x = mod(p.x + time * 0.1, 1.0);
	if (texture(p, .6, 1.)) gl_FragColor = black;
	if (texture(p, 0., 0.)) gl_FragColor = blink ? text1 : text2;
}