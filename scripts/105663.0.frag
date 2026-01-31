// https://www.shadertoy.com/view/Ntt3Rr
precision highp float;
uniform float time;
uniform vec2 mouse,resolution;

void main( void ) {
    vec4 col;
    float a=3.14/2.;
    vec2 uv1 = (gl_FragCoord.xy*44.-resolution)/resolution.y/60.*mat2(cos(a), -sin(a),sin(a),cos(a))-vec2(0,.31);
    for(int c=0;c<2;c++){
        vec2 uv = uv1;
        for(int i=0;i<6;i++)
        {
            uv = fract(uv.y+uv.x+uv-time/8.)-.35;
            uv *= (uv.y-uv.x)*4.;
            col[c] -= abs(abs(uv.x)-uv.y);
            col.yx += vec2(.12,.22)-uv*uv.yx*col.yz/3.;
        }
    }
    gl_FragColor = abs(col-atan(col,vec4(1.5,1.5,.5,-1))*1.5);
}