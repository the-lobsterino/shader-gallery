//https://neort.io/product/bvcrf5s3p9f7gigeevf0
//https://bit.ly/3lDYymP
precision mediump float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define rot(a) mat2(cos(a),sin(a),-sin(a),cos(a))

float map(vec3 p){
    p.xy*=rot(time*.5);
    p.xz*=rot(time*.3);
    float h=sin(time)*.5+.5;
    p.x-=clamp(p.x,-h,h);
    return length(vec2(length(p.xy)-.3,p.z))-.1;
}
vec3 color;
void main(){
    vec2 uv=(gl_FragCoord.xy-.5*resolution)/resolution.y;
    vec3 rd=normalize(vec3(uv,1));
    vec3 p=vec3(0,0,-3);
    float d=1.;
//    for(;++i<99.&&d>.001;)p+=rd*(d=map(p));
//    if(d<.001)gl_FragColor+=3./i;
    for (int i = 0; i < 99; i++) {//rays loop
         p+=rd*(d=map(p-0.2));
        if (d <.001) {
	    color=vec3(p);
            break;
        }else{
            color=vec3(0.5);
	}
    }
    gl_FragColor=vec4(color,1);
}