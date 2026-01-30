#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

    vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
    p *= mat2(cos(time*1.0), sin(time*1.0), -sin(time*1.0), cos(time*1.0));
    
    vec3 destColor = vec3(0.0);
    for(float i = 2.0; i < 20.0; i++){
        float j = i * i;
        vec2 q = p + vec2(sin(time * j)*length(cos(time)), cos(time * j)*length(sin(time)));
        destColor += 0.01 * abs(atan(time)) / length(q);
    }
    float g = destColor.r * abs(sin(time*5.0));
    float b = destColor.r * abs(sin(time*3.0));
    float r = destColor.r * abs(cos(time*0.2));
    
    destColor = vec3(0.0);
    for(float i = 2.0; i < 20.0; i++){
        float j = i * i;
        float tt = time + sin(time)*2.;
        vec2 q = p + vec2(sin(tt * j)*length(cos(tt)), cos(tt * j)*length(sin(tt)));
        destColor += 0.01 * abs(atan(tt)) / length(q);
    }
    
    g += destColor.r * abs(sin(time*2.0));
    b += destColor.r * abs(sin(time*5.0));
    r += destColor.r * abs(cos(time*0.5));
    
    gl_FragColor = vec4(r, g, b, 1.0);

}