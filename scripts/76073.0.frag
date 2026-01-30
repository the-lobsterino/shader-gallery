precision mediump float;
uniform vec2 resolution;
uniform sampler2D tex0;

#define PI 3.14159265359

void main(void){
   	vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
	float t = floor(0.02 / abs(abs(sin(1.0)) - length(p)));
    	vec3 col = texture2D(tex0, vec2(p.x, -p.y)).xyz;
    	gl_FragColor = vec4(vec3(t) * col, 1.0);
}