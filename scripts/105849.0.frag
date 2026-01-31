precision mediump float;
uniform float time;
uniform vec2  resolution;

void main(void){
    vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
    p.x+=sin(time);
    // ring
    float u = abs(sin((atan(p.y, p.x)*2. + length(p) * sin(time*0.511)) * .75) * 0.1);
    float t = 0.0095 / abs(u + .6+(0.025)/2. - length(p));
    
    gl_FragColor = vec4(vec3(t), 1.0);
}