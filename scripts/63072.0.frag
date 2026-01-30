precision mediump float;
uniform float time; // time
uniform vec2  resolution; // resolution

void main(void){
	vec3 destColor = vec3(0.0, 0.3, 0.7);
    vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y); // 正規化
    float l = 0.05 / abs(length(p) - 0.5);
    //l += 0.05 / abs(length(p*sin(time)) - 0.3);
    //l += 0.05 / abs(length(p) - 0.1);
    gl_FragColor = vec4(l*destColor, 1.0);
}