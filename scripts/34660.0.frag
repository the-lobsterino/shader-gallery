precision mediump float;uniform float time;uniform vec2 resolution;
void main(void){vec2 uv=(gl_FragCoord.xy/resolution.xy)*2.-1.;gl_FragColor=vec4((length(fract(uv/dot(uv,uv)+time)-.5)-.4)*50.);}