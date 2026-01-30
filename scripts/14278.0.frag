precision highp float;
uniform vec2 resolution;
uniform float time;
uniform vec2 mouse;

vec3 hash(in vec3 p) {
    return fract(sin( mat3(
        15.34, 75.23, 153.49,
        359.24, 216.48, 32.64,
        620.34, 1405.75, 3450.29  
        ) * p ) * 43768.34);
}

float smin( float a, float b, float k )
{
    float h = clamp( 0.5+0.5*(b-a)/k, 0.0, 1.0 );
    return mix( b, a, h ) - k*h*(1.0-h);
}

float voronoi(in vec3 q) {
    vec3 p = floor(q);
    vec3 f = fract(q);
    float d = 0.0;
    for(int i = -1; i <= 1; i++)
    for(int j = -1; j <= 1; j++)
    for(int k = -1; k <= 1; k++) {
        vec3 b = vec3(i, j, k);
        float r = length(b + hash(p + b) - f);
        d += exp( -32.0*r );
    }
    return -(1.0/64.0)*log( d );
}



float Scale = 3.0;					// 0.0 - 4.0


// Scaling center
vec3 Offset = vec3(1.0,1.0,1.0);		// 0.0 - 1.0


// Number of fractal iterations.
const int Iterations = 8; // 0 - 100



float NewMenger(vec3 z)
{
		//z*=1.9;
	
	for(int n = 0; n < Iterations; n++) 
	{
		//"z = rot *z;"
		//z.z*=0.2*time;
	//	"z.x+=0.01*time;"
		z = abs(z);
		if (z.x<z.y){ z.xy = z.yx;}
		if (z.x< z.z){ z.xz = z.zx;}
		if (z.y<z.z){ z.yz = z.zy;}
		z = Scale*z-Offset*(Scale-1.0);
		if( z.z<-0.5*Offset.z*(Scale-1.0))  z.z+=Offset.z*(Scale-1.0);

		}				

	
	return abs(length(z)-0.0 ) * pow(Scale, float(-Iterations-1));
}


float sdPlane(in vec3 p) {
    return p.y;
}

float sdSphere(in vec3 p, in float r) {
    return length(p) - r ;
}

float map(in vec3 p) {
    float d = sdPlane(p);
    d = min(d, sdSphere(p - vec3(0.0, 0.25, 0.0), 0.25));
	d = min(d,NewMenger(p));
    return d;
}

vec3 calcNormal(in vec3 p) {
    vec3 e = vec3(0.001, 0.0, 0.0);
    vec3 nor = vec3(
        map(p + e.xyy) - map(p - e.xyy),
        map(p + e.yxy) - map(p - e.yxy),
        map(p + e.yyx) - map(p - e.yyx)
    );
    return normalize(nor);
}

float castRay(in vec3 ro, in vec3 rd, in float maxt) {
    float precis = 0.002;
    float h = precis * 2.0;
    float t = 0.0;
    for(int i = 0; i < 60; i++) {
        if(abs(h) < precis || t > maxt) continue;
        h = map(ro + rd * t);
        t += h;
    }
    return t;
}

float softshadow(in vec3 ro, in vec3 rd, in float mint, in float maxt, in float k) {
    float sh = 1.0;
    float t = mint;
    float h = 0.0;
    for(int i = 0; i < 30; i++) {
        if(t > maxt) continue;
        h = map(ro + rd * t);
        sh = min(sh, k * h / t);
        t += h;
    }
    return sh;
}

vec3 render(in vec3 ro, in vec3 rd) {
    vec3 col = vec3(1.0);
    float t = castRay(ro, rd, 20.0);
    vec3 pos = ro + rd * t;
    vec3 nor = calcNormal(pos);
    vec3 lig = normalize(vec3(-0.4, 0.7, 0.5));
    float dif = clamp(dot(lig, nor), 0.0, 1.0);
    float spec = pow(clamp(dot(reflect(rd, nor), lig), 0.0, 1.0), 16.0);
    float sh = softshadow(pos, lig, 0.02, 20.0, 7.0);
    col = col * (dif + spec) * clamp(sh, 0.2, 1.0);
    return col;
}

void main() {
    vec2 uv = gl_FragCoord.xy / resolution.xy;
    vec2 p = uv * 2.0 - 1.0;
    p.x *= resolution.x / resolution.y;
    float theta = mouse.x * 3.141592 * 2.0+0.1*time;
    float x = 3.0 * cos(theta);
    float z = 3.0 * sin(theta);
    vec3 ro = vec3(x*0.2, 8.0, z*2.);
    vec3 ta = vec3(0.0, 0.25, 0.0);
    vec3 cw = normalize(ta - ro);
    vec3 cp = vec3(0.0, 1.0, 0.0);
    vec3 cu = normalize(cross(cw, cp));
    vec3 cv = normalize(cross(cu, cw));
    vec3 rd = normalize(p.x * cu + p.y * cv + 7.5 * cw);
    vec3 col = render(ro, rd);
    
    gl_FragColor = vec4(col, 1.0);
}