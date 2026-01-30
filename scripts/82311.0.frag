
//www.zonex.space
//The below equation has no solution, but if you put the equation back into the variables it gains solutions due to cancelling like in -1/x=x
//the equation is: y=x=(x + 1/(y*(x + y))
//and it's turned complex: x=(s+z*i),y=(b+d*i), so:
//(s (b^2 + d^2) ((b + s)^2 + (d + z)^2) + b^2 + b s - d^2 - d z)/((b^2 + d^2) ((b + s)^2 + (d + z)^2)) - (i (-z (b^2 + d^2) ((b + s)^2 + (d + z)^2) + 2 b d + b z + d s))/((b^2 + d^2) ((b + s)^2 + (d + z)^2))

    precision highp float;
    uniform vec2 resolution;
    uniform float time;
    void main(){vec2 p=(gl_FragCoord.yx/resolution.yx-.5)/resolution.xy*min(resolution.x,resolution.y)*9.;
    vec2 s=p;
    vec2 b=p;
    for (int f=0;f<41;f+=1)if(abs(s.y)<5.){
        b=-sin(time*.618)/vec2((s.x *(b.x*b.x + b.y*b.y) *(pow(b.x + s.x,2.) + pow(b.y + s.y,2.)) + b.x*b.x + b.x*s.x - b.y*b.y - b.y * s.y)/
       ((b.x*b.x + b.y*b.y) *(pow(b.x + s.x,2.) + pow(b.y + s.y,2.))),
    -((-s.y*(b.x*b.x + b.y*b.y)* (pow(b.x + s.x,2.) + pow(b.y + s.y,2.)) + 2.*b.x*b.y + b.x* s.y + b.y*s.x))/
    ((b.x*b.x + b.y*b.y) *(pow(b.x + s.x,2.) + pow(b.y + s.y,2.)))
    );
    s=b;
    b-=1./b;
        }
    gl_FragColor=vec4(s.x*b.y,s.y*b.x,b.y*s.y,1.);}












