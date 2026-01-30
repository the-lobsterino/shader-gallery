#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable


uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define time time/5.0

float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy );

	vec2 uv = position;
	
	const int size = 6;
	float dist = 10000.;
	for (int x=-size; x<size; ++x) {
		for (int y=-size; y<size; ++y) {
			vec2 pt = vec2(float(x)*0.1, float(y)*0.1);
			pt.x = rand(pt);
			pt.y = rand(pt);
			float rt = rand(vec2(x, y));
			float rr = rand(vec2(y, x));
			rr = rr * (2. + sin(time * (rt - 0.5) * 0.3 + rt)) * 0.2;
			rt += time * (rt - 0.5) * 0.5 + float(x);
			pt.x += rr * cos(rt) * 0.5;
			pt.y += rr * sin(rt) * 0.5;
			float r = length(pt - uv);
			dist = min(r, dist);
		}
	}
	float color = dist * 8.;
	
	gl_FragColor = vec4(vec3( color, color, color), 1.0);

}