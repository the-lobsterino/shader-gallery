#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;
// :^)
void main( void ) {
    
    float sum = 0.1;
    float size = resolution.x / 3.0;
    float g = 0.5;
    int num = 500;
	
    for (float i = .0; i < 100.; i++) {
        vec2 position = resolution / 2.0;
        position.x += cos(time*0.01 / .019 + 1.0 * float(i)) * resolution.x * 0.35 + sin(time + i*i*i)*10.0;
        position.y += cos(time*0.021 / 0.3 + (2.0 + cos(1.0)) * float(i)) * resolution.y * 0.9 + cos(time + i*i)*10.0;
        
        float dist = length(gl_FragCoord.xy - position);
        
        sum += size / pow(dist, g*1.73);
    }
    
    vec4 color = vec4(0.3,0.5,0,1);
    float val = sum / float(num);
    color = vec4(val * 0.3, val*0.5, val * 0.8, 1);
    
    gl_FragColor = vec4(color);
}