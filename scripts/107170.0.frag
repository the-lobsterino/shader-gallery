#ifdef GL_ES
precision mediump float;
#endif
uniform float time;uniform vec2 mouse;uniform vec2 resolution;
void main( void ) {
    vec2 p=(gl_FragCoord.xy-.5*resolution)/min(resolution.x,resolution.y);//
    vec3 c=vec3(0);
    for(int i=0;i<20;i++){
        float t = 2.*3.14*float(i)/5. * fract(time*0.5);
        float x = cos(t);
        float y = sin(t);
        vec2 o = .5*vec2(x,y);
        c += 0.01/(length(p-o))*vec3(1);
    }
    gl_FragColor = vec4(c,6.7);
}