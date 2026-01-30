#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main(void) {

    vec2 pos = gl_FragCoord.xy / resolution;

 	float pixelCol = 0.0;

	float mTime = time * 0.4;
	
	float sinxs[10];
	sinxs[0] = sin(pos.x*5.0 - mTime/1.0);
	sinxs[1] = sin(pos.x*3.0 - mTime);
	sinxs[2] = sin(pos.x*3.2 + mTime);
	sinxs[3] = sin(pos.x*1.0 - mTime);
	sinxs[4] = sin(pos.x*2.4 + mTime);
	sinxs[5] = sin(pos.x*2.9 + mTime);
	sinxs[6] = sin(pos.x*1.8 - mTime);
	
	for(int i = 0; i < 7; ++i){
		if(pos.y < 0.5 + sinxs[i]*0.2 && pos.y > 0.49 + sinxs[i]*0.2){
			pixelCol = 1.0;	
		}
	}
	
	
    gl_FragColor = vec4(vec3(0.0, pixelCol*pos.y-0.2, pixelCol*pos.y*2.0),1.0);
}