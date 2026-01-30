#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy );
	
	float x = (position.x*16.01);
	float y = (position.y*8.01)-4.0;
	
	float rx = x + time;
	float ry = y + time;

	float r = 0.0;
	float g = 0.0;
	float b = 0.0;
	float a = 0.10;

	
	float m = 0.0;
	float t = 0.0;
	float fn = 0.0;
	
	for (int n = 0; n < 20; n++){
		fn = float(n+1)/10.0;
		m = fn*sin(rx+fn)*cos((x+fn)*fn)+sin(y/fn);
	
		m -= y;
		t = abs((((x/8.0)/fn)-fn)*abs(1.0/((x+fn)*m)));	
		r += t*(fn/10.0);
		g += t*(fn/7.0);
		b += t*(fn/4.0);
	}
	
	
	r = r * a;
	g = g * a;
	b = b * a;
	gl_FragColor = vec4(abs(r),abs(g),abs(b),abs(a));

}
