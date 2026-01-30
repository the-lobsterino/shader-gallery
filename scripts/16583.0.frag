precision mediump float;
uniform float time;
float rand(vec2 n) 
{
	
	return fract(sin(dot(30.0*n, vec2(12.9898, 4.1414))) * 137.585453);
}
void main(void) {
	highp vec2 pos = vec2(gl_FragCoord.x/960.0,gl_FragCoord.y/640.0);
	mediump float height = 0.5 +
			0.25*sin(7.0*pos.x+1.0*time)
			+0.02*sin(67.4*pos.x+0.82*time)
			+0.015*sin(91.4*pos.x-0.93*time);
	if (pos.y < height) {
		float relposx = pos.x + 0.3*(pos.y - height);
		float depth = height - pos.y;
		if (depth < 0.03) {
			float dist = 0.2 + 500000.0*depth*depth*depth + 0.5*rand(pos);
			float slope = 0.3 + 
				0.25*7.0*cos(7.0*relposx+1.0*time)
				+0.02*67.4*cos(67.4*relposx+0.82*time)
				+0.015*91.4*cos(91.4*relposx-0.93*time);
			if (slope<0.0) slope=0.0;
			gl_FragColor = vec4(
				0.1+0.08*slope/dist + 0.3*pos.y,
				0.1+0.08*slope/dist + 0.3*pos.y,
				1.0,1.0);
		} else {
			gl_FragColor = vec4(
				0.1 + 0.3*pos.y,
				0.1 + 0.3*pos.y,
				1.0,1.0);
		}
	} else {
		gl_FragColor = vec4(0.8-0.3*pos.y,0.8-0.3*pos.y,1.0,1.0);
	}
}