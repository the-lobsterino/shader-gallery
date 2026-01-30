#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main(){
	vec2 uv = (gl_FragCoord.xy / resolution - 0.5) * vec2(resolution.x/resolution.y,1);
	vec3 ray = normalize(vec3(uv,0.01));
	vec3 p = vec3(0,0,fract(09.4 * time));
	for(float i = 0.0; i < 50.0; i++){
		float d = 0.04 * distance(fract(2.0 * p),vec3(0.5));
		if(d < 0.015){
			gl_FragColor = vec4(float(i)/80.0);
			return;
		}
		p+= ray * d;
	}
	gl_FragColor = vec4(1);
}