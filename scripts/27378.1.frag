#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float smin( float a, float b, float k ) {
	float h = clamp( 0.5+0.5*(b-a)/k, 0.0, 1.0 );
	return mix( b, a, h ) - k*h*(1.0-h);
}

float cross2(vec2 a, vec2 b) {
	return a.x*b.y-a.y*b.x;
}

void main( void ) {
	vec2 p = ( gl_FragCoord.xy / resolution.xy);
	p = p * 2.0 - 1.0;
	p.x *= resolution.x / resolution.y;
	float col = 0.0;
	vec2 tt1 = vec2(-0.3+sin(time)*1.0, 0.15);
	vec2 tt2 = vec2(0.0+sin(time)*1.0, -0.15);
	vec2 tt3 = vec2(0.3+sin(time)*1.0, 0.15);
	float dd1, dd2, dd3;
	float a = 0.0;
	dd1 = clamp(cross2((p-tt1), (tt2-tt1))*5.0, 0.0, 1.0);
	dd2 = clamp(cross2((p-tt2), (tt3-tt2))*5.0, 0.0, 1.0);
	dd3 = clamp(cross2((p-tt3), (tt1-tt3))*5.0, 0.0, 1.0);
	a = dd1 + dd2 + dd3;
	vec2 t1 = vec2(0.2, -0.3);
	vec2 t2 = vec2(0.8, -0.3);
	vec2 t3 = vec2(0.5, 0.3);
	float d1, d2, d3;
	float b = 0.0;
	d1 = clamp(cross2((p-t1), (t2-t1))*5.0, 0.0, 1.0);
	d2 = clamp(cross2((p-t2), (t3-t2))*5.0, 0.0, 1.0);
	d3 = clamp(cross2((p-t3), (t1-t3))*5.0, 0.0, 1.0);
	b = d1 + d2 + d3;
	col = smin(a, b, 0.3);
	//col = min(a,b);
	col = floor(1.0 -col);
	//col = a;
	gl_FragColor = vec4(col, col, col, 1.0 );
}