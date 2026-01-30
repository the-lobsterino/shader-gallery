#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main(void){
	
	vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
	vec3 color = vec3(0.0, 1.0, 1.0);
	
	float j = 0.0;
	vec2 x = p + vec2(-0.5, 0.0);
	vec2 z = vec2(0.0, 0.0);
	
	for(float i = 0.0; i < 360.0; i++){
		
		j++;
		if(length(z) > 2.0){break;}
		z = vec2(z.x * z.x - z.y * z.y, 2.0 * z.x * z.y) + x * 1.3;
	}
	
	float s = float(j) / z.x / z.y * abs(length(z));
	
	gl_FragColor = vec4(color * s, 1.0);
	
}
