#ifdef GL_ES
precision mediump float;
#endif
#extension GL_OES_standard_derivatives : enable
uniform float time; // time
uniform vec2  resolution; // resolution


void main(void){
    vec2 p = (gl_FragCoord.xy * 3.0 - resolution) / min(resolution.x, resolution.y);
    vec3 destColor = vec3(0.0);
    float a,b,c =0.0;
    for(float xx=0.0;xx<2.0;xx++)
    for(float yy=0.0;yy<2.0;yy++){
        float px = p.x - xx;
        float py = p.y - yy;
        vec2 sp = vec2(px,py); 
        destColor += 0.0125/ length(sp);
    for(float n = 0.0; n < 4.0; n++){
    for(float i = 0.0; i < 6.0; i++){
        float j = i + 1.0;
        float nxy = n*0.2;
        vec2 q = sp + vec2(cos(time*j), sin(time*j)) * (0.2+nxy);
	    if(i==0.0||i==3.0){
		    a += 0.0125/ length(q);}
	    else if(i==1.0||i==4.0){
		    b += 0.0125/length(q);}
	    else if(i==2.0||i==5.0){
		    c += 0.0125/ length(q);}

    }}}
    gl_FragColor = vec4(destColor,1.0);
    gl_FragColor += vec4(a,b,c,0.0);
}