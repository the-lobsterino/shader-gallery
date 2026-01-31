#ifdef GL_ES
precision highp float;
#endif

// glslsandbox uniforms
uniform float time;
uniform vec2 resolution;
varying vec2 surfacePosition;
#define res resolution
#define surfacePos ( surfacePosition*res.y + res/2. ).xyxy
#define time ( time*16. + 0. )
const float PI = 3.141592653589793*4.;

mat2 rotate2D(float r){
    return mat2(cos(r), sin(r), -sin(r), cos(r));
}

void twigl(out vec4 o, vec4 FC, vec2 r, float t) {
    float g=0.4,e=1.3,s,a;
	
    for(float i=0.;i<27.;i++)
    {
        vec3 p=vec3((8.*FC.xy*sin(2.)-r)/r.y*g,g);
	    p.xy -= vec2( 1.5,1.5 );
        mat2 m=rotate2D(t*.02);
        p.xz*=m;
        p.yz*=m;
        p.z+=t/PI;
        p++;
        a=s=21.90;
        for(int j=0;j<7;j++) 
	{
            p=mod(--p,2.)-1.,p.yz*=rotate2D(PI/4.),a=min(a,length(p-0.1)),s/=e=dot(p,tan(p))*.667;
            p/=e;
        }
        g+=e=0.5/s;
        o+=0.01/(e*sin(50./time)+g)*(1.5+cos(vec4(11.*sin(time/400.),4,7,9)*a)); 
    }
}

void main(void)
{
    twigl(gl_FragColor, gl_FragCoord, resolution, time);
    gl_FragColor.a = 1.;
}//ändrom3da4twist