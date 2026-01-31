float orgy(vec2 p) {
        float pl=0., expsmo=0.;
        float t=sin(time*8.);
        float a=-.35+t*.02;
        p*=mat2(cos(a),sin(a),-sin(a),cos(a));
        p=p*.07+vec2(.728,-.565)+t*.017+vec2(0.,t*.014);
        for (int i=0; i<10; i++) {
            p.x=abs(p.x);
            p=p*2.+vec2(-2.,.85)-t*.04;
            p/=min(dot(p,p),1.06);  
            float l=length(p*p);
            expsmo+=exp(-1.2/abs(l-pl));
            pl=l;
        }
        return expsmo*1.4;
    }