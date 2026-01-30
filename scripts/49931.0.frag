precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

// position, x_speed, y_speed, x_range, y_range
float ball(vec2 p, float fx, float fy, float ax, float ay) {
	float size = 0.05;
	vec2 position = vec2(
		p.x + sin(time * fx) * ax, 
		p.y + cos(time * fy) * ay
	);	
	
	return size / length(position);
}

float cursor(vec2 p) {
	float offsetX = 2.0;
	float offsetY = 1.0;
	float size = 0.09;
    	vec2 position = vec2(
		offsetX + p.x - mouse.x * (offsetX*2.), 
		offsetY + p.y - mouse.y * (offsetY*2.)
	);	
    	return size / length(position);
}

void main(void) {
	vec2 uv = gl_FragCoord.xy / resolution.xy;
	vec2 p = -1.0 + 2.0 * uv;	
	p.x *= resolution.x / resolution.y;

	float col = 0.0;

	col += cursor(p);
	
	col += ball(vec2(1.0,1.0), 0.0, 0.0, 0.0, 0.0);
	col += ball(p, 1.0, 2.0, 0.1, 0.2);
	col += ball(p, 1.5, 1.0, 0.4, 0.3);
	col += ball(p, 0.1, 0.5, 0.6, 0.7);

	
	col = max(mod(col, 0.4), min(col, 2.0));
	
	gl_FragColor = vec4(
		col * sin(time)/2.0, 
		col * 0.3, 
		col * 0.3, 1.0
    	);
}