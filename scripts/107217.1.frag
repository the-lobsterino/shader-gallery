#ifdef GL_ES

precision mediump float;

#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main(void) {

    vec2 p=(gl_FragCoord.xy-.5*resolution)/min(resolution.x,resolution.y) * 10.0 * (sin(time / 2.0) / 10.0);

    vec3 c=vec3(0);

    for(int i=0;i<40;i++){
        float t = 2.*3.14*float(i)/20. * time*0.1;

        float x = cos(t*1.5);
        float y = sin(t+cos(time / 1.0));

        vec2 o = .2*vec2(x,y);

        c += 0.01/(length(p-o))*vec3(0.2);
    }

    gl_FragColor = vec4(c,1.0);

}