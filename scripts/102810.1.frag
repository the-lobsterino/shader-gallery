precision mediump float;
uniform float time; // time
uniform vec2  resolution; // resolution

void main(void){
	vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y); // r は resolution
   	float l = abs(sin(length(p)*10.0+time*10.0));
	float m = abs(cos(length(p)*10.0+time*10.0));
    gl_FragColor = vec4(l,0.4, m,0.9);
}