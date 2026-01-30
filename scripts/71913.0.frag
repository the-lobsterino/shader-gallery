#ifdef GL_ES
precision mediump float;
#endif
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

// https://twigl.app/?ol=true&mode=7&source=//%20Zoom%0Avec2%20p%3D(FC.xy*2.-r)/r.y/exp(5.-cos(t)*6.)%2Bvec2(-0.7454,.113)%3B%0A//%20Matrices%20as%20complex%20numbers,%20mat2(x,-y,y,x)%20is%20x%20%2B%20iy%0Afor(mat2%20Z,C%3Dmat2(p.x,-p.y,p.y,p.x)%3Blength(Z[0])%3C2.%26%26o.w%2B%2B%3C2e2%3Bo%2B%3D.005)Z%3DZ*Z%2BC%3B

void main( void ) {
	vec2 uv = (gl_FragCoord.xy * 2. - resolution) / resolution.y;
	vec2 p = uv / exp(5. - cos(time) * 6.) + vec2(-.7454, .113);
	vec4 o;
	mat2 z;
	mat2 c = mat2(p.x, -p.y, p.y, p.x);
	for (int i = 0; i < 200; i++) {
		if (length(z[0]) >= 2.) break;
		z = z * z + c;
		o += .005;
	}
	gl_FragColor = o;
}
