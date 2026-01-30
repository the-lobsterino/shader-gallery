#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


float m_distance(float x, float y){
    return sqrt(pow(0.0 - x, 2.0) + pow(0.0 - y, 2.0));
}
float mleap(float x){
	return x * x * (3.0 - 2.0 * x);
}

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy );
	
	
	position = 2.0 * position - 1.0;
	
	position.x *= (resolution.x / resolution.y);
	
	float color = m_distance(position.x, position.y);
	float t = sin(time/ 0.8) / 0.9 ;
	float tm = t * 0.1 + 0.2;
	tm = mleap(tm);
	color = smoothstep(tm, (tm + 0.2) / 1.0 - t/5.0 + 0.3, color); 

	gl_FragColor = vec4( color, color, color, 1.0);



}