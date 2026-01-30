precision mediump float;
uniform float time;
uniform vec2  mouse;
uniform vec2  resolution;

void main(void){
	//vec2 m = vec2(mouse.x * 2.0 - 1.0, -mouse.y * 2.0 + 1.0);
	vec2 m = vec2(1.0,1.0);
    	vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
    
    	const int iterNum = 100;
	int j = 0;
	vec2 offset = vec2(-0.9, -0.5); 
	vec2  translate = p  + mouse + offset; 
	float scale = 0.8;
    
	vec2  z = p;
    
	for(int i = 0; i < iterNum; i++){
		j++;
        	if(length(z) > 2.0) break;
        	z = vec2(z.x * z.x - z.y * z.y, 2.0 * z.x * z.y) + translate * scale;
	}
    
	vec3 rgb = vec3(0.0, 1.0, 0.0);
	float t = float(j) / float(iterNum);

	gl_FragColor = vec4(rgb*t, 1.0);    
}