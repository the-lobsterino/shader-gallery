#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;

void main( void ) {	
    vec2 p=(gl_FragCoord.xy-.5*resolution)/resolution.y;
    float tun=5./sqrt(dot(p, p)),en=float(fract(7.7/tun+time)>=.07/fract(tun+sin(time))),l=float(.275<fract(tun+sin(time*1.)+atan(p.x, p.y)*7.7));
    gl_FragColor=vec4(tun<.05||en<l);
}