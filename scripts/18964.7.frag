precision lowp float;
#define between(v,x1,x2) (v>= x1 && v<=x2)
#define betweensq(v,x1,x2) (v>pow(x1 -x2, 2.0) && v<=pow(x1 + x2, 2.0))
//WORST MODF EVER
float modf(float a, float b) {
	if (a > 0.0) {return(a - (float(int(a / b))*b));}
	else {return a + (float(int(abs(a)/b) + 1)*b); }
}

#define pi 3.141592653589793238462643383279
#define dotted(a, range) (modf(a, range.x + range.y) < range.x)
#define col1 vec4(0.5,0.1,0.,1.0)
#define col2 vec4(1.,1.,1.,1.)

uniform sampler2D tex;

uniform vec2 mouse;
uniform vec2 resolution;
vec4 c(bool v, vec4 inital) {float i = float(v); return(col1*i + inital*(1.0-i)); }
void main()
{
    float aspect = ( resolution.x / resolution.y);
    vec2 position = ( gl_FragCoord.xy / resolution.xy );
    position.x *= aspect;
    vec2  pnt = vec2(0.5*aspect,0.5);
    float dr = 2.0/resolution.y;
    float fr = 0.2;
    float r1 = fr;
    float r2 = 1.5*fr;
    float r3 = 2.0*fr;
    float r4 = 2.5*fr;
    float r5 = 3.0*fr;
    vec2 dstsq = pnt-position.xy;
    float rp = dot(dstsq, dstsq);
    vec2 dotrange = vec2(0.2, 0.2);
    float angle = atan(dstsq.y,dstsq.x);
    vec4 rezcol = col2;
    rezcol = c(betweensq(rp,r1,dr) && between(angle,-pi,pi) && dotted(angle, dotrange), rezcol);
    rezcol = c(betweensq(rp,r2, dr) && between(angle,-pi,pi/3.1) && dotted(angle, vec2(0.01, 0.01)), rezcol);
    rezcol = c(betweensq(rp,r3, dr) && between(angle,-pi,pi/4.6)&& dotted(angle, vec2(0.01, 0.1)), rezcol);
    rezcol = c(betweensq(rp,r4, dr) && between(angle,-pi,pi/8.8)&& dotted(angle, vec2(0.1, 0.01)), rezcol);
    rezcol = c(betweensq(rp,r5, dr) && between(angle,-pi/2.0,pi/21.3)&& dotted(angle, vec2(0.05, 0.25)), rezcol);
    gl_FragColor = rezcol;
}
