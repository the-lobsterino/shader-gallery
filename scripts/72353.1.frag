//Original shader from: https://www.shadertoy.com/view/wtKBRd
precision mediump float;
uniform float time;
uniform vec2 resolution;
#define R(p,a,r)mix(a*dot(p,a),p,cos(r))+sin(r)*cross(p,a)
void main(void)
{
    gl_FragColor=vec4(0);
    vec3 p,r=vec3(resolution,1.),
    d=normalize(vec3((gl_FragCoord.xy-.5*r.xy)/r.y,1));
    float g=0.,e,s;
    for(float i=1.;i<129.;++i)
    {
        p=g*d-vec3(0,-.25,1.3);
        p=R(p,normalize(vec3(1,8,0)),21.+time*.1);
	    s=3.;
        for(int i=0;i<4;++i) {
            s*=e=1./clamp(dot(p,p),.1,.6);
            p=vec3(2,4,2)-abs(abs(p)*e-vec3(3,5,1));
        }
        g+=e=min(length(p.xz)-.02,abs(p.y))/s+.001;
        gl_FragColor.rgb+=mix(vec3(1),(cos((log(s)/5.)*6.3+vec3(0,23,21))*.5+.5),.5)*pow(cos(i*i/64.),2.)/e/2e4;
     }
	
}