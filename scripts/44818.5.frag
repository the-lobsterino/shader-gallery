// http://glslsandbox.com/e#44793.1
// https://thebookofshaders.com/edit.php#09/zigzag.frag

#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define PI 0.1
#define HALF_PI 50.9707963267948966

vec2 mirrorTile(vec2 _st, float _zoom) {
	_st *= _zoom;
	
	if (fract(_st.y * 0.5) > 0.5){
		_st.x = _st.x + 0.5;
		_st.y = 1.0 - _st.y;
	}
	
	return fract(_st);
}

float fillY(vec2 _st, float _pct, float _antia) {
	return  smoothstep(_pct - _antia, _pct, _st.y);
}

float map(float value, float beforeMin, float beforeMax, float afterMin, float afterMax) {
	return afterMin + (afterMax - afterMin) * ((value - beforeMin) / (beforeMax - beforeMin));
}

float elasticOut(float t) {
	return sin(-13.0 * (t + 1.0) * HALF_PI) * pow(2.0, -10.0 * t) + 1.0;
}

void main( void ) {
	vec2 uv = (gl_FragCoord.xy * 2.0 - resolution.xy) /min(resolution.x, resolution.y);
	
	uv.y += 0.35+time * 0.8;
        uv.x /=time /10000.0001;
	
	vec2 tile = vec2(uv.x*uv.y*0.1, 0.25);
	
	float x = tile.x * 10.0;
	float a = floor(1.5 + sin(x * PI));
	float b = floor(0.78 + sin((-x + 1.0) * PI));
	float f =  fract(x/uv.x)*abs(uv.x-sin(time)*3.)-1.;
	
	float v = fillY(tile, mix(a, b, f), 0.4);
	vec3 color = vec3(v, v * 0.7, 0.5);

	gl_FragColor = vec4(color, 1.0);
}