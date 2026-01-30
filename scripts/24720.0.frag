#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

    vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
    vec3 destColor = vec3(0.0);
    
    for(float i = 0.0; i < 100.0; i++){
        float j = i + .01;
        vec2 q = p + vec2(1.,0.)*sin(time*7.+j*j) + vec2(0.,1.)*cos(time*3.+i)*.7;
        destColor += .01 * abs(cos(time)*.4+.5) / length(q);
    }
	
    float r = destColor.r * abs(sin(time*3.+7.));
    float g = destColor.r * abs(sin(time*5.+5.));
    float b = destColor.r * abs(sin(time*7.+3.));
    
    gl_FragColor = vec4(r,g,b, 1.);
}