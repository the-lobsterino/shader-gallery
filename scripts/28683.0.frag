#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


float rand(vec2 v){
	return fract(sin(dot(v.xy,vec2(10.9898,78.233))) * 43758.5453);
}
					
void main( void ) {

	vec2 gp = gl_FragCoord.xy;
	float c = 0.0;
	for(int i = 0; i < 8; i++){
		float fi = float(i);
		vec2 p = vec2(gp.x, gp.y);
		vec2 dir = (-vec2(0.5, rand(vec2(fi, fi)) + 0.02));
		float l = 100.0 + rand(vec2(-fi, fi)) * 100.0;
		float m = 100.0 + rand(vec2(-fi, -fi)) * 100.0;
		vec2 dl = -dir * l + m + vec2(20.0, 50.0);
		vec2 d = dir * (mod(time/2., 30.0) * 2000.0 * ( 0.7 + 0.3 * rand(vec2(fi, -fi))) + fi);
		vec2 s = floor((p - d + m * 0.5) / dl);
		p -= s * dl + rand(s) * 80.0 - 40.0;
		c += max(0.0, 1.0 - distance(d + clamp(dot(p - d, dir), -l * (0.5 + 0.5 * rand(s + fi * 1000.0)), 0.0) * dir, p) * 0.5);
	}
	gl_FragColor = vec4( vec3( c ) * 0.5 + 0.25, 1.0 );

}