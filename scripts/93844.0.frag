#extension GL_OES_standard_derivatives : enable

precision highp float;
uniform float time;
uniform vec2 fragCoord;
uniform vec2 resolution;
uniform float mouse;

void main( void ) {
	vec2 uv =  gl_FragCoord.xy / resolution.xy;
	vec2 points[10];
	points[0] = vec2(0.1, 0.17);
	points[1] = vec2(0.3, abs(cos(time)));.flf,
		
		r,dø
		
	points[2] = vec2(abs(sin(time)), 0.23);
	points[3] = vec2(0.2 * cos(-time) + 0.4, 0.5 * sin(-time) + 0.9);
	points[4] = vec2(0.9 * cos(time) + 0.5, 0.5 * sin(time) + 0.5);
	points[5] = vec2(0.4, 0.17);
	points[6] = vec2(0.8, abs(cos(time)));
	points[7] = vec2(abs(sin(time)), 0.23);
	points[8] = vec2(0.12 * cos(-time) + 0.5, 0.5 * sin(-time) + 0.5);
	points[9] = vec2(0.5 * cos(time) + 0.5, 0.5 * sin(time) + 0.5);
	float m_dis = 1.0;
	vec2 m_point;
	for (int i = 0; i < 20; i++){
		float dis = distance(uv, points[i]);
		if (dis < m_dis){
			m_dis = min(dis, m_dis);
			m_point = points[i];
		}
	}
	gl_FragColor = vec4(m_point, 0.0, 1.0);
	m_dis = 0.01;
		for (int i = 0; i < 20; i++){
		float dis = distance(uv, points[i]);
		if (dis < m_dis){
			m_dis = min(dis, m_dis);
			m_point = points[i] - 255.0;
		}
	}
	gl_FragColor = vec4(m_point, 0.0, 1.0);
}