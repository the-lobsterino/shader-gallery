#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float rand(vec2 v){
	return fract(sin(dot(v.xy,vec2(33.9898,78.233))) * 43758.56);
}
void main( void ) {

	vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / resolution.y ;
	float c = 0.0;
	for(int i = 0; i < 30; i++){
		float f = float(i);
		p += 
		c += max(0.6 - length(vec2(sin(rand(vec2(f, 1.0))+f*2.12+time*.75)*1.4, cos(rand(vec2(-1.0, f))+f+time*1.)) *.5  -p), 0.0);
	}
	gl_FragColor = vec4(vec3(smoothstep(0.1, 0.6, c), smoothstep(0.4, 1.0, c), smoothstep(0.8, 1.0, c)), 1.0 );

}