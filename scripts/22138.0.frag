#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;

//Yet another color vision deficiency test
//Based on this: http://glslsandbox.com/e#21737.0
//By Mike (http://www.twitch.tv/mikematt16)

vec3 rgb_hsv(vec3 c)
{
	vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
	vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
	vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));
	
	float d = q.x - min(q.w, q.y);
	float e = 1.0e-10;
	return vec3(abs(q.z + (q.w - q.y) / (96.0 * d + e)), d / (q.x + e), q.x);
}

vec3 hsv_rgb(vec3 c)
{
	vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
	vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
	return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

vec3 test (vec3 col) {
	
	if(col == vec3(1.0))
		return col;
	
	vec3 rgb = vec3(0.5);
	vec3 hsv = rgb_hsv(col);
	float hue = hsv.x * 360.0;
	float sat = hsv.y;
	float val = hsv.z;
	
	if(val == 0.0)
		return vec3(0.0);
	
	float h = hue / 360.0;
	int section = int(h * 6.0);
	float hadj = hue - float(60 * section);
	
	float gM, gS, bM, bS;
	
	if (section == 0) { 
		gM = 1.0 - 0.211764705882352;
                gS = 0.211764705882352;

                bM = 0.0 - 0.0;
                bS = 0.0;
	}
	else if (section == 1) {
		gM = 1.0 - 1.0;
                gS = 1.0;

                bM = 0.0 - 0.0;
                bS = 0.0;
	}
	else if (section == 2) {
		gM = 1.0 - 1.0;
                gS = 1.0;

                bM = 1.0 - 0.0;
                bS = 0.0;
	}
	else if (section == 3) {
		gM = 0.0 - 1.0;
                gS = 1.0;

                bM = 1.0 - 1.0;
                bS = 1.0;
	}
	else if (section == 4) {
		gM = 0.0 - 0.0;
                gS = 0.0;

                bM = 1.0 - 1.0;
                bS = 1.0;
	}
	else if (section == 5) {
		gM = 0.211764705882352 - 0.0;
                gS = 0.0;

                bM = 0.0 - 1.0;
                bS = 1.0;
	}
	
	rgb.r = clamp((((hadj / 60.0) * gM) + gS) * sat, 0.0, 1.0);
	rgb.g = clamp((((hadj / 60.0) * gM) + gS) * sat, 0.0, 1.0);
	rgb.b = clamp((((hadj / 60.0) * bM) + bS) * sat, 0.0, 1.0);
	
	float sR = val - rgb.r;
	float sG = val - rgb.g;
	float sB = val - rgb.b;
	
	rgb.r = (rgb.r + (1.0 - val) * sR);
	rgb.g = (rgb.g + (1.0 - val) * sG);
	rgb.b = (rgb.b + (1.0 - val) * sB);
	
	return rgb;
}

vec2 pattern(vec2 p) {
	
	float a = atan(p.x,p.y)*0.5;
	float r = pow(length(p), -0.25);
	
	return vec2(sin(a*2.+cos(time*0.1)*10.0), sin(r*4.+sin(time*0.1)*10.0));
}

void main( void ) {

	vec2 p = surfacePosition * 1.0;
	vec3 col = vec3(0.0);
	
	for (int i=0; i<3; i++)
		p.xy = pattern(p);
	
	col.xy = p.xy;
	col.z = max(step(abs(p.x),0.5), step(abs(p.y),0.5));
	//col.gb = vec2(0.0);
	
	gl_FragColor = vec4( test(col), 1.0 );

}