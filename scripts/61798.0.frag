precision mediump float;
uniform float time; // time
uniform vec2  resolution; // resolution
uniform vec2  mouse; // mouse

void main(void){
	
	float t = time;
	vec2 r = resolution;
	
    	vec2 p = (gl_FragCoord.xy * 2.0 - r) / min(r.x, r.y);
	vec3 destColor = vec3(mouse.x, mouse.y, 0.7);
	float f = 0.0;
    	for(float i = 0.0; i < 20.0; i++){
        float s = sin(t + i * 0.314) * 0.5;
        float c = cos(t + i * 0.314) * 0.5;
        f += 0.0025 / abs(length(p + vec2(c, s)) - 1.5*abs(sin(1.3 * t)));
    	}
    	gl_FragColor = vec4(vec3(destColor * f), 1.0);
}