	#ifdef GL_ES
	precision mediump float;
	#endif
	
	precision mediump float;
	uniform float time;
	uniform vec2  mouse;
	uniform vec2  resolution;
	
	void main(void){
	    vec2 m = vec2(abs(tan(time))*1.35 - 1.0, cos(time*7.7)/6.3 - 1.0);
	//    vec2 p = ( gl_FragCoord.xy / resolution.xy );
		
		vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / resolution;
	    float t = sin(length(m *p) * 15.2 + 100.*abs(cos(time/8.3)) );
	    gl_FragColor = vec4(vec3(t), 1.0);
}