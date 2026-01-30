#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
        vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
        float c = 0.0;

        c += sin(gl_FragCoord.x*4.0) / length(p);
        c *= 0.5 * cos(gl_FragCoord.y*4.0) / length(p);
        
        for(float i = 0.0; i < 6.0; i++){
            float j = i * 1.046 - time * 3.0;
            vec2 q = p*(cos(time*8.0))*2.0 + vec2(sin(j), cos(j));
            c += 0.1 * abs(sin(time*3.0)) / (length(q)*0.5);
        }
        
        gl_FragColor = vec4(c*abs(sin(time*5.0)), c*abs(sin(time*3.0)), c*abs(cos(time*0.2)), 1.0);
}