

#ifdef GL_ES
precision mediump float;
#endif


uniform float time;
uniform vec2 resolution;

#define iTime time
#define iResolution resolution


#define rot(a) mat2(cos(a),sin(a),-sin(a),cos(a))
const mat2 rMat = 0.1*rot(1.5);

mat2 rotMat(float a) 
{ float s=sin(a), c=cos(a); return mat2(c,s,-s,c); }

vec3 render(vec2 p) {
    p*=rotMat(iTime*.1)*(.0002+.7*pow(smoothstep(0.,.5,abs(.5-fract(iTime*.01))),3.));
    p.y-=.2266;
    p.x+=.2082;
    vec2 ot=vec2(100.);
    float m=100.;
    for (int i=0; i<150; i++) {
        vec2 cp=vec2(p.x,-p.y);
        p=p+cp/dot(p,p)-vec2(0.0, 0.25);
        p*=rMat;
        ot=min(ot,abs(p)+.15*fract(max(abs(p.x),abs(p.y))*.25+iTime*.05+float(i)*.15));
        m=min(m,abs(length(p.y)));
    }
    ot=exp(-200.*ot)*2.;
    m=exp(-200.*m);
    return vec3(ot.x,ot.y*.5+ot.x*.3,ot.y)+m*.2;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 uv = (fragCoord-iResolution.xy*0.5)/iResolution.y;
    vec2 d = vec2(0.0, 0.5)/iResolution.xy;
    vec3 col = render(uv);//+render(uv+d.xy)+render(uv-d.xy)+render(uv+d.yx)+render(uv-d.yx);
    fragColor = vec4(col*1.5, 1.0);
}


void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}