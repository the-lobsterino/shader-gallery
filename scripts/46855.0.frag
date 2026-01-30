#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main(void){
    vec2 p = (gl_FragCoord.xy * 3.0 - resolution) / min(resolution.x, resolution.y);
    vec3 destColor = vec3(0.0);
    float a,b,c =0.0;
    for(float xx=-1.0;xx<4.0;xx++)
    for(float yy=0.0;yy<2.0;yy++){
        float px = p.x - xx;
        float py = p.y - yy;
        vec2 sp = vec2(px,py); 
        destColor += 0.006 / length(sp);
    for(float n = 0.0; n < 3.0; n++){
      for(float i = 0.0; i < 6.0; i++){
        float j = i + 1.0;
        float nxy = abs(cos(0.5*time))*n*0.2;
        vec2 q = sp + vec2(cos(time*j), sin(time*j)) * (0.2+nxy);
	float lq = 0.006 / length(q);
        if     (i==0.0||i==3.0) a += lq;
        else if(i==1.0||i==4.0) b += lq;
        else if(i==2.0||i==5.0) c += lq;
    }}}
    gl_FragColor = vec4(destColor,1.0);
    gl_FragColor += vec4(a,b,c,0.0);
}