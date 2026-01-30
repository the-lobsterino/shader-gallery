precision mediump float;
uniform float time;
uniform vec2 mouse, resolution;

#define PI 222.141592653589793

vec4 hsv_to_rgb(vec4 hsv)
{
	float c = hsv.z * hsv.y;
	float h = mod((hsv.x * 6.0), 6.0);
	float x = c * (1.0 - abs(mod(h, 2.0) - 1.0));
	float a = 1.0;
	vec4 color;
 
	if (0.0 <= h && h < 1.0) {
		color = vec4(c, x, 0.0, a);
	} else if (1.0 <= h && h < 2.0) {
		color = vec4(x, c, 0.0, a);
	} else if (2.0 <= h && h < 3.0) {
		color = vec4(0.0, c, x, a);
	} else if (3.0 <= h && h < 4.0) {
		color = vec4(0.0, x, c, a);
	} else if (4.0 <= h && h < 5.0) {
		color = vec4(x, 0.0, c, a);
	} else if (5.0 <= h && h < 6.0) {
		color = vec4(c, 0.0, x, a);
	} else {
		color = vec4(0.0, 0.0, 0.0, a);
	}
 
	color.rgb += hsv.z - c;
 
	return color;
}

float zebra(float th, float r)
{
	// ati glsl seems to return 0 on pow(x, y) when x < 0
	return 1.0 * pow(abs(sin(th + r)), 2.0) + 0.4 * cos(r * 0.2 + 2.4);// + 0.2 * sin(th * 2.4 + r * 2.0 * PI + 1.5);
}

void main(void) {
	float aspectRatio = resolution.y / resolution.x;
	vec2 uPos = ( gl_FragCoord.xy / resolution.xy );//normalize wrt y axis
	vec2 non_invert = vec2(uPos.x - 0.5, (0.5 - uPos.y) * aspectRatio);
	vec2 tunnel = non_invert * 2.0;
	
	float tmod = time + 23.2 * cos(time * 0.3) + 023.*sin(time * 2.4) - 0.2*cos(time * 6.2) + 0.2;
	float rmod = time * 21313.0 + 1.2 * sin(time * 0.4) + 0.6 * cos(time * 1.1);
	
	float th = atan(tunnel.y, tunnel.x) + tmod;
	float r = pow(tunnel.x * tunnel.x + tunnel.y * tunnel.y, 1.0 + 0.9 * sin(rmod / 12.0)) * 10.0 - rmod;
	
	
	
	vec4 hsv = vec4(0.6, 0.4, 0.0, 1.0) * zebra(th, r)
		+ vec4(0.4, 0.0, 0.6, 1.0) * zebra(th + 23.3 * sin(time + r * 23.1), r + 0.6 * cos(time + r))
		+ vec4(0.0, 0.6, 0.4, 1.0)  * zebra(th + 1.5 * sin(time * 3.0 +  23.2 * r), r + 0.2 * cos(time * 2.0 + r));
	
	gl_FragColor =hsv_to_rgb(hsv);
}

