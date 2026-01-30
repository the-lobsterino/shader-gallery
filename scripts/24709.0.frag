#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

    vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
    vec3 destColor = vec3(0.0);
    
    for(float i = 0.0; i < 10.0; i++){
        float j = i + 1.23;
        vec2 q = p + vec2(sin(time * j), cos(time * j));
        destColor += 0.05 * abs(cos(time)) / length(q);
    }
    
    for(float i = 0.0; i < 10.0; i++){
        float j = i + 6.54;
        vec2 q = p + vec2(-sin(time * j) * abs(sin(time*3.0) + 0.5), cos(time * j) * abs(sin(time*3.0) + 0.5));
        destColor += 0.02 * abs(tan(time/1.23)) / length(q);
    }
    
    float g = destColor.r * abs(sin(time*2.0));
    float b = destColor.r * abs(sin(time*5.0));
    float r = destColor.r * abs(cos(time*0.5));
    
    gl_FragColor = vec4(r, g, b, 1.0);
}