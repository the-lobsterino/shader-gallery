#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;

void main( void ) {
    
    float sum = 0.0;
    float size = resolution.x / 3.0;
    float g = 0.5;
    int num = 500;
	
    for (int i = 0; i < 5; i++) {
        vec2 position = resolution / 2.0;
        position.x += sin(time*0.01 / .09 + 1.0 * float(i)) * resolution.x * 0.15;
        position.y += cos(time*0.01 / 0.3 + (2.0 + sin(1.0)) * float(i)) * resolution.y * 0.25;
        
        float dist = length(gl_FragCoord.xy - position);
        
        sum += size / pow(dist, g);
    }
    
    vec4 color = vec4(0,0,0,1);
    float val = sum / float(num
			   );
    color = vec4(0, val*0.8, val, 1);
    
    gl_FragColor = vec4(color);
}