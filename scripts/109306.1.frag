#extension GL_OES_standard_derivatives : enable

precision mediump float;
uniform float time;
uniform vec2  mouse;
uniform vec2  resolution;

void main(void){
    vec2 m = vec2(mouse.x * 2.0 - 1.0, mouse.y *2.0- 1.0);
    vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
    float lambda = time*2.5;

    float t =0.02/abs(tan(lambda) - length(p));
    float t2 = atan(p.y, p.x) + time;

    vec2 something = vec2(1., (sin(time)+ 1.)*0.5);

    float dotProduct = dot(vec2(t),something)/length(p);

    gl_FragColor = vec4(vec3(dotProduct), 1.0);

}

//hi i am still learning shaders if you want to help me learn  pls make something with this or with my previous post, thanks and much love - elijah