    precision mediump float;
    uniform vec2 resolution;
    uniform vec2 mouse;
    uniform float time;
    uniform sampler2D backbuffer;
    #define res resolution

    void main(){
        vec2 uv = (2.*gl_FragCoord.xy-res)/res.y;
        vec2 tuv = gl_FragCoord.xy/res;
        float t = time*2.;
        vec3 c = vec3(.2/length(.8*vec2(cos(t*.7),sin(t))-uv*1.5));
        vec3 b = texture2D(backbuffer, tuv).xyz;
        c = mix(c*vec3(.3,.6, 1),b, .92);
        gl_FragColor = vec4(c, 1);
    }