#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 resolution;

bool eq(float x, float y) {
	return abs(x - y) < 1e-4;
}

void main( void ) {
	vec4 rgb1 = vec4(1., 0., 0., 1.); vec3 hsv;
	float mx = max(max(rgb1.r, rgb1.g), rgb1.b), mn = min(min(rgb1.r, rgb1.g), rgb1.b);
	if (eq(mx, mn)) hsv.x = 0.; if (eq(mx, rgb1.r) && rgb1.g >= rgb1.b) hsv.x = 60. * (rgb1.g - rgb1.b) / (mx - mn);
	if (eq(mx, rgb1.r) && rgb1.g < rgb1.b) hsv.x = 60. * (rgb1.g - rgb1.b) / (mx - mn) + 360.;
	if (eq(mx, rgb1.g)) hsv.x = 60. * (rgb1.b - rgb1.r) / (mx - mn) + 120.;
	if (eq(mx, rgb1.b)) hsv.x = 60. * (rgb1.r - rgb1.g) / (mx - mn) + 240.;
	hsv.x += time * 20.; hsv.x = mod(hsv.x, 360.); if (eq(mx, 0.)) hsv.y = 0.; else hsv.y = 1. - mn / mx; hsv.z = mx;
	float hi = floor(hsv.x / 60.), f = hsv.x / 60. - hi, p = hsv.z * (1. - hsv.y), q = hsv.z * (1. - f * hsv.y), t = hsv.z * (1. - (1. - f) * hsv.y);
	if (eq(hi, 0.)) gl_FragColor = vec4(hsv.z, t, p, 1.);
	if (eq(hi, 1.)) gl_FragColor = vec4(q, hsv.z, p, 1.);
	if (eq(hi, 2.)) gl_FragColor = vec4(p, hsv.z, t, 1.);
	if (eq(hi, 3.)) gl_FragColor = vec4(p, q, hsv.z, 1.);
	if (eq(hi, 4.)) gl_FragColor = vec4(t, p, hsv.z, 1.);
	if (eq(hi, 5.)) gl_FragColor = vec4(hsv.z, p, q, 1.);

}