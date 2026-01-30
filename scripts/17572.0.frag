#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float f(float x) {
	return 0.5 * sin(time) * sin(4.*x);
}

float df(float x) {
	float h = 0.000001;
	return (f(x+h)-f(x))/h;
}

float line_f(float x) {
	return sqrt(4.-20000.*x*x);	
}

void main( void ) {
	vec2 ASPECT_RATIO = vec2(resolution.x/resolution.y, 1.0);
	
	// x is an element of [-resolution.x/resolution.y, resolution.x/resolution.y]
	// y is an element of [-1.0, 1.0]
	vec2 uv = (( gl_FragCoord.xy / resolution.xy) - vec2(0.5, 0.5)) * ASPECT_RATIO * 2.;
	
	// y = m*x + c
	float m = df(uv.x);
	float c = -df(uv.x) * uv.x + f(uv.x);
	
	// stroke width of line
	float stroke_width = 0.01;
	
	// Workaround for dividing by zero problem
	if(m == 0.) {
		m += 0.0000001;
	}
	
	// some math used to render the line
	float m_normal = -1./m;
	float x_final = (-m_normal * uv.x - c + uv.y)/(m - m_normal);
	float y_final = m * x_final + c;
	
	vec2 s = vec2(x_final, y_final);
	
	float shade = line_f(distance(uv, s));
	
	gl_FragColor = vec4(shade, shade, shade, 1.0);
}