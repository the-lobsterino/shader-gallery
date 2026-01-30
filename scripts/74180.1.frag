#ifdef GL_ES
precision lowp float;
#endif

uniform vec2 resolution;
uniform float time;



void main(){
    float width = max(1.0, resolution.x/resolution.y);
    float height = max(1.0, resolution.y/resolution.x);
    vec2 coords = vec2(gl_FragCoord.x * width, (resolution.y - gl_FragCoord.y)*height)/resolution.xy;
    coords += vec2(cos(time*3.0),sin(time*2.0))*0.35;
    vec2 dist = coords - vec2(width/2.0, height/2.0);
    vec3 color = 1.0 - vec3(smoothstep(0.01, 0.011, dot(dist, dist)));

    gl_FragColor = vec4(color,1.0);
}