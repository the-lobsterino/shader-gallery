#ifdef GL_ES
precision mediump float;
#endif
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define LX 35.
#define LY (50./3.)
#define speed 3.

float noise(vec2 seed) {
 return fract(sin(dot(seed, vec2(12.9898,4.1414)))*43758.5453);
}

float getHeight(vec2 uv) {
    float t_time = time;
 uv+=.5;
 uv.y-=t_time*speed;
 float y1 = floor(uv.y);
 float y2 = floor(uv.y+1.);
 float x1 = floor(uv.x) ;
 float x2 = floor(uv.x+1.);
 float iX1 =mix(noise(vec2(x1, y1)), noise(vec2(x2, y1)),fract(uv.x));
 float iX2 =mix(noise(vec2(x1, y2)), noise(vec2(x2, y2)),fract(uv.x));
 return mix(iX1, iX2, fract(uv.y) );
}

float getDistance(vec3 p) {
 return p.z-(1.-cos(p.x*15.))*.3*getHeight(vec2(p.x*LX, p.y*LY));
}

float getGridColor(vec2 uv){
	float col;
	vec3 cam = vec3(0, 1, .1);
	vec3 ray = normalize(vec3(uv.x, -1, uv.y));
	float distOrigin = 0.;
	float t = time * speed;

	vec3 p = cam;
	for(int i = 0; i < 70; i++){
		float distSur = getDistance(p);
		if (distOrigin > 2.) break;
		if (distSur < .001) {
			float w = .2 * distOrigin;
			float xl = smoothstep(w, 0., abs(fract(p.x * LX)-.05));
			float yl = smoothstep(w*2., 0., abs(fract(p.y * LY - t)-.5));
			col = max(xl, yl);
			break;
		}
		p += ray * distSur;
		distOrigin += distSur;
	}
	return max(0., col - (distOrigin * .8));
}

void main() {
	vec2 uv = (gl_FragCoord.xy - .5 * resolution) / resolution.y;
//	uv.y += .18;
	vec3 c = getGridColor(uv) * 4. * vec3(.2,.05,1.);
	gl_FragColor = vec4(c, 1.);
}
