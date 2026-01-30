#ifdef GL_ES
precision mediump float;
#endif
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;
uniform sampler2D backbuffer;

const float num = 280.;
void main( void ) {
	float colRate = .005;
	
	const float span = 3.;
	const float r = span / 2.;
	vec3 color;
	vec2 uv = surfacePosition;
	uv *= 360.;
	float zt = -9e9;
	float zb = 9e9;
	
	float soft_z = 100.;
	
	vec3 t2 = texture2D(backbuffer, gl_FragCoord.xy/resolution).rgb-1./256.;
	
	vec3 tX = 1.-texture2D(backbuffer, fract((gl_FragCoord.xy+vec2(4,2))/resolution)).rgb-1./256.;
	

	for (float y = -num; y <= num; y += span) {
		float x = (floor(uv.x / span) + .5) * span + y / 2.;
		if (abs(x) > num) continue;
		float time = time + y;
		float t = radians(length(vec2(x, y)));
		t *= sin(time * .2) * 3.;
//		t -= time;
		float z = (cos(t) * 100. - cos(t * 3.) * 30.) + y / 2.;
		soft_z = mix(soft_z, z, 2.5*cos(z*10.0))/(1.+50.*length(t2));
		soft_z -= 0.04*sign(soft_z);
		vec2 p = vec2(x - y / 2., soft_z);
		float d = distance(uv, p) / r - 1.;
		float cd = length(vec2(x, y)) * colRate;
		float o = time * -1.5;
		if (d <= 0.) {
			if (z < zb || zt < z) { // occlusion
				color = vec3(1.0+sin(cd+o), 1.0+sin(cd+2.0+o), 1.0+sin(cd-2.0+o)) * -d;
			}
			break;
		}
		zt = max(zt, z);
		zb = min(zb, z);
	}
	gl_FragColor = vec4(max(mix(color, tX, 0.7), t2), 1);
	gl_FragColor = vec4(max(mix(gl_FragColor.rgb, tX, 0.2), t2), 1);
	
	
}
