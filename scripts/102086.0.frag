/*
 * Original shader from: https://www.shadertoy.com/view/slsfWH
 */

#ifdef GL_ES
precision highp float;
#endif

// glslsandbox uniforms
uniform float time;
uniform vec2 resolution;

// shadertoy emulation
#define iTime time
#define iResolution resolution

// --------[ Original ShaderToy begins here ]---------- //

mat2 Rot(float a) {
    float s = sin(a);
    float c = cos(a);
    return mat2(vec2(c, -s),vec2( s, c));
}

float sdCircle( in vec2 p, in float r ) 
{
    return length(p)-r;
}
// Test if point p crosses line (a, b), returns sign of result
float testCross(vec2 p,vec2 a, vec2 b) {
    return sign((b.y-a.y) * (p.x-a.x) - (b.x-a.x) * (p.y-a.y));
}

// Determine which side we're on (using barycentric parameterization)
float signBezier(vec2 p,vec2 A, vec2 B, vec2 C)
{ 
    vec2 a = C - A, b = B - A, c = p - A;
    vec2 bary = vec2(c.x*b.y-b.x*c.y,a.x*c.y-c.x*a.y) / (a.x*b.y-b.x*a.y);
    vec2 d = vec2(bary.y * 0.5, 0.0) + 1.0 - bary.x - bary.y;
    return mix(sign(d.x * d.x - d.y), mix(-1.0, 1.0, 
        step(testCross(A, B, p) * testCross(B, C, p), 0.0)),
        step((d.x - d.y), 0.0)) * testCross(A, C, B);
}

// Solve cubic equation for roots
vec3 solveCubic(float a, float b, float c)
{
    float p = b - a*a / 3.0, p3 = p*p*p;
    float q = a * (2.0*a*a - 9.0*b) / 27.0 + c;
    float d = q*q + 4.0*p3 / 27.0;
    float offset = -a / 3.0;
    if(d >= 0.0) { 
        float z = sqrt(d);
        vec2 x = (vec2(z, -z) - q) / 2.0;
        vec2 uv = sign(x)*pow(abs(x), vec2(1.0/3.0));
        return vec3(offset + uv.x + uv.y);
    }
    float v = acos(-sqrt(-27.0 / p3) * q / 2.0) / 3.0;
    float m = cos(v), n = sin(v)*1.732050808;
    return vec3(m + m, -n - m, n - m) * sqrt(-p / 3.0) + offset;
}

// Find the signed distance from a point to a bezier curve
float sdBezier(vec2 p,vec2 A, vec2 B, vec2 C)
{    
    B = mix(B + vec2(1e-4), B, abs(sign(B * 2.0 - A - C)));
    vec2 a = B - A, b = A - B * 2.0 + C, c = a * 2.0, d = A - p;
    vec3 k = vec3(3.*dot(a,b),2.*dot(a,a)+dot(d,b),dot(d,a)) / dot(b,b);      
    vec3 t = clamp(solveCubic(k.x, k.y, k.z), 0.0, 1.0);
    vec2 pos = A + (c + b*t.x)*t.x;
    float dis = length(pos - p);
    pos = A + (c + b*t.y)*t.y;
    dis = min(dis, length(pos - p));
    pos = A + (c + b*t.z)*t.z;
    dis = min(dis, length(pos - p));
    return dis * signBezier(A, B, C, p);
}

float path(vec2 p,float r){
	
	
	
	return max(max(p.y,-p.x),max(p.x,-p.y))-r;
}

vec4 olho(vec2 p){
	vec4 col=vec4(1.0);
   
		   
	
 
  
    
float d=-25.0;
float d2=50.0;

float t12=sdBezier(((p*Rot(float(0)))+vec2(float(-8.5625)/d,float(17.295868)/d2)),vec2(0.348, 0.295),vec2(0.184, 0.448),vec2(-0.088, 0.358)); 
 
  
 
 float t13=sdBezier(((p*Rot(float(0)))+vec2(float(-8.75)/d,float(15.709091)/d2)),vec2(0.348, 0.295),vec2(0.158, 0.471),vec2(-0.088, 0.331)); 
 
  
 
 float t14=sdBezier(((p*Rot(float(0)))+vec2(float(-10.5625)/d,float(24.806614)/d2)),vec2(0.376, 0.413),vec2(0.085, 0.328),vec2(-0.013, 0.478)); 
 
  
 
 float t15=sdBezier(((p*Rot(float(0)))+vec2(float(-10.875)/d,float(26.287605)/d2)),vec2(0.069, 0.437),vec2(0.054, 0.439),vec2(0.014, 0.418)); 
 
  
 
 float t16=sdBezier(((p*Rot(float(0)))+vec2(float(-11.875)/d,float(25.123966)/d2)),vec2(0.069, 0.437),vec2(0.054, 0.439),vec2(0.014, 0.442)); 
 
  
 
 float t17=sdBezier(((p*Rot(float(0)))+vec2(float(-12.75)/d,float(22.47934)/d2)),vec2(0.069, 0.437),vec2(0.001, 0.425),vec2(-0.04, 0.464)); 
 
  
 
 float t18=sdBezier(((p*Rot(float(0)))+vec2(float(-12.5)/d,float(21.315704)/d2)),vec2(0.069, 0.437),vec2(0.085, 0.425),vec2(-0.051, 0.444)); 
 
  
 
 float t19=sdBezier(((p*Rot(float(0)))+vec2(float(-12.875)/d,float(20.998348)/d2)),vec2(0.069, 0.437),vec2(0.01, 0.47),vec2(-0.005, 0.484)); 
 
  
 
 float t20=sdBezier(((p*Rot(float(0)))+vec2(float(-12.1875)/d,float(20.152065)/d2)),vec2(0.069, 0.437),vec2(0.035, 0.467),vec2(0.039, 0.484)); 
 
  
 
 float t21=sdBezier(((p*Rot(float(0)))+vec2(float(-11.6875)/d,float(19.517357)/d2)),vec2(0.069, 0.437),vec2(0.035, 0.467),vec2(0.024, 0.468)); 
 
  
 
 float t22=sdBezier(((p*Rot(float(0)))+vec2(float(-10.375)/d,float(19.834713)/d2)),vec2(0.069, 0.437),vec2(0.035, 0.467),vec2(0.002, 0.509)); 
 
  
 
 float t23=sdBezier(((p*Rot(float(0)))+vec2(float(-10.75)/d,float(20.152065)/d2)),vec2(0.069, 0.437),vec2(0.022, 0.467),vec2(0.017, 0.509)); 
 
  
 
 float t24=sdBezier(((p*Rot(float(0)))+vec2(float(-8.9375)/d,float(19.728928)/d2)),vec2(0.069, 0.437),vec2(0.022, 0.467),vec2(0.008, 0.496)); 
 
  
 
 float t25=sdBezier(((p*Rot(float(0)))+vec2(float(-9.75)/d,float(20.04628)/d2)),vec2(0.069, 0.437),vec2(0.039, 0.467),vec2(0.041, 0.496)); 
 
  
 
 float t26=sdBezier(((p*Rot(float(0)))+vec2(float(-11.125)/d,float(25.547108)/d2)),vec2(0.392, 0.436),vec2(0.121, 0.37),vec2(0.041, 0.496)); 
 
  
 
 float t27=sdBezier(((p*Rot(float(0)))+vec2(float(-10)/d,float(24.806614)/d2)),vec2(0.392, 0.436),vec2(0.252, 0.539),vec2(0.002, 0.488)); 
 
  
 
 float t28=sdBezier(((p*Rot(float(0)))+vec2(float(-7.3125)/d,float(24.489258)/d2)),vec2(0.153, 0.42),vec2(0.011, 0.366),vec2(-0.008, 0.488)); 
 
  
 
 float t29=sdBezier(((p*Rot(float(0)))+vec2(float(-3.125)/d,float(27.451241)/d2)),vec2(0.008, 0.538),vec2(0.013, 0.496),vec2(-0.008, 0.485)); 
 
  
 
 float t30=sdCircle(((p+vec2(-5.25/d,1.322315/d2)))*Rot(float(0.5)),0.03); 
 
  
 
 //#sdf

//float d25= sdBezier(p,vec2(.2,.566),vec2(.640,.415),vec2(.664,.552));


    
    
    //#operacao
	
	col=mix(col,vec4(float(0),float(0),float(0),float(1)), 1.0-smoothstep(0.0,0.01,abs(t12))) ; 
 
 
 col=mix(col,vec4(float(0),float(0),float(0),float(1)), 1.0-smoothstep(0.0,0.01,abs(t13))) ; 
 
 
 col=mix(col,vec4(float(0),float(0),float(0),float(1)), 1.0-smoothstep(0.0,0.01,abs(t14))) ; 
 
 
 col=mix(col,vec4(float(0),float(0),float(0),float(1)), 1.0-smoothstep(0.0,0.01,abs(t15))) ; 
 
 
 col=mix(col,vec4(float(0),float(0),float(0),float(1)), 1.0-smoothstep(0.0,0.01,abs(t16))) ; 
 
 
 col=mix(col,vec4(float(0),float(0),float(0),float(1)), 1.0-smoothstep(0.0,0.01,abs(t17))) ; 
 
 
 col=mix(col,vec4(float(0),float(0),float(0),float(1)), 1.0-smoothstep(0.0,0.01,abs(t18))) ; 
 
 
 col=mix(col,vec4(float(0),float(0),float(0),float(1)), 1.0-smoothstep(0.0,0.01,abs(t19))) ; 
 
 
 col=mix(col,vec4(float(0),float(0),float(0),float(1)), 1.0-smoothstep(0.0,0.01,abs(t20))) ; 
 
 
 col=mix(col,vec4(float(0),float(0),float(0),float(1)), 1.0-smoothstep(0.0,0.01,abs(t21))) ; 
 
 
 col=mix(col,vec4(float(0),float(0),float(0),float(1)), 1.0-smoothstep(0.0,0.01,abs(t22))) ; 
 
 
 col=mix(col,vec4(float(0),float(0),float(0),float(1)), 1.0-smoothstep(0.0,0.01,abs(t23))) ; 
 
 
 col=mix(col,vec4(float(0),float(0),float(0),float(1)), 1.0-smoothstep(0.0,0.01,abs(t24))) ; 
 
 
 col=mix(col,vec4(float(0),float(0),float(0),float(1)), 1.0-smoothstep(0.0,0.01,abs(t25))) ; 
 
 
 col=mix(col,vec4(float(0),float(0),float(0),float(1)), 1.0-smoothstep(0.0,0.01,abs(t26))) ; 
 
 
 col=mix(col,vec4(float(0),float(0),float(0),float(1)), 1.0-smoothstep(0.0,0.01,abs(t27))) ; 
 
 
 col=mix(col,vec4(float(0),float(0),float(0),float(1)), 1.0-smoothstep(0.0,0.01,abs(t28))) ; 
 
 
 col=mix(col,vec4(float(0),float(0),float(0),float(1)), 1.0-smoothstep(0.0,0.01,abs(t29))) ; 
 
 
 col=mix(col,vec4(float(0),float(0),float(0),float(1)), 1.0-smoothstep(0.0,0.01,t30)) ; 
 
   
  return col;

}


vec4 cabelo(vec2 p ){
  
	vec4 col=vec4(1.0);
    
 
  
    
float d=-25.0;
float d2=50.0;


float t=sdBezier(((p*Rot(float(0)))+vec2(float(2.9375)/d,float(-21.950413)/d2)),vec2(0.28, 0.354),vec2(0.46, 0.268),vec2(0.527, 0.04)); 
 
  
 
 float t2=sdBezier(((p*Rot(float(0)))+vec2(float(9.3125)/d,float(-5.553719)/d2)),vec2(0.274, 0.359),vec2(0.329, 0.268),vec2(0.292, -0.157)); 
 
  
 
 float t3=sdBezier(((p*Rot(float(0)))+vec2(float(9.75)/d,float(20.575207)/d2)),vec2(0.274, 0.359),vec2(0.243, -0.033),vec2(0.285, -0.245)); 
 
  
 
 float t4=sdBezier(((p*Rot(float(0)))+vec2(float(0.75)/d,float(-20.046282)/d2)),vec2(0.274, 0.366),vec2(0.174, 0.514),vec2(-0.076, 0.367)); 
 
  
 
 float t5=sdBezier(((p*Rot(float(0)))+vec2(float(-8.125)/d,float(-20.152065)/d2)),vec2(0.274, 0.359),vec2(0.121, 0.237),vec2(0.068, 0.04)); 
 
  
 
 float t6=sdBezier(((p*Rot(float(0)))+vec2(float(-13.3125)/d,float(-4.072728)/d2)),vec2(0.274, 0.359),vec2(0.228, 0.237),vec2(0.28, -0.29)); 
 
  
 
 float t7=sdBezier(((p*Rot(float(0)))+vec2(float(-13.125)/d,float(28.61488)/d2)),vec2(0.274, 0.359),vec2(0.284, 0.069),vec2(0.251, -0.078)); 
 
  
 
 float t8=sdBezier(((p*Rot(float(0)))+vec2(float(0.8125)/d,float(-20.046276)/d2)),vec2(0.274, 0.359),vec2(0.273, 0.394),vec2(0.356, 0.395)); 
 
  
 
 float t9=sdBezier(((p*Rot(float(0)))+vec2(float(-1.6875)/d,float(-11.477686)/d2)),vec2(0.164, 0.333),vec2(0.299, 0.357),vec2(0.356, 0.395)); 
 
  
 
 float t10=sdBezier(((p*Rot(float(0)))+vec2(float(-6.5625)/d,float(-8.304132)/d2)),vec2(0.164, 0.171),vec2(0.247, 0.357),vec2(0.356, 0.394)); 
 
  
 
 float t11=sdBezier(((p*Rot(float(0)))+vec2(float(-11.4375)/d,float(3.120663)/d2)),vec2(0.347, 0.001),vec2(0.328, 0.357),vec2(0.356, 0.394)); 
 
  
 
 float t12=sdBezier(((p*Rot(float(0)))+vec2(float(-11.625)/d,float(23.008266)/d2)),vec2(0.373, 0.001),vec2(0.359, 0.357),vec2(0.356, 0.394)); 
 
  
 
 float t13=sdBezier(((p*Rot(float(0)))+vec2(float(-11.1875)/d,float(35.385124)/d2)),vec2(0.4, 0.078),vec2(0.359, 0.189),vec2(0.356, 0.244)); 
 
  
 
 float t14=sdBezier(((p*Rot(float(0)))+vec2(float(-1.5625)/d,float(-19.305782)/d2)),vec2(0.491, 0.078),vec2(0.367, 0.189),vec2(0.356, 0.244)); 
 
  
 
 float t15=sdBezier(((p*Rot(float(0)))+vec2(float(1.875)/d,float(-10.94876)/d2)),vec2(0.433, 0.078),vec2(0.405, 0.189),vec2(0.356, 0.244)); 
 
  
 
 float t16=sdBezier(((p*Rot(float(0)))+vec2(float(3.8125)/d,float(-2.380166)/d2)),vec2(0.369, 0.078),vec2(0.373, 0.189),vec2(0.356, 0.244)); 
 
  
 
 float t17=sdBezier(((p*Rot(float(0)))+vec2(float(4.1875)/d,float(5.871074)/d2)),vec2(0.322, -0.325),vec2(0.327, -0.04),vec2(0.356, 0.244)); 
 
  
 
 float t18=sdBezier(((p*Rot(float(0)))+vec2(float(3.375)/d,float(34.221489)/d2)),vec2(0.322, 0.062),vec2(0.355, 0.092),vec2(0.356, 0.244)); 
 
  
 
 float t19=sdBezier(((p*Rot(float(0)))+vec2(float(4.6875)/d,float(33.375206)/d2)),vec2(0.281, 0.055),vec2(0.355, 0.092),vec2(0.356, 0.244)); 
 
  
 
 float t20=sdBezier(((p*Rot(float(0)))+vec2(float(5.375)/d,float(33.692566)/d2)),vec2(0.281, 0.055),vec2(0.343, 0.092),vec2(0.372, 0.244)); 
 
  
 
 float t21=sdBezier(((p*Rot(float(0)))+vec2(float(5.5)/d,float(33.269424)/d2)),vec2(0.281, 0.055),vec2(0.28, 0.064),vec2(0.293, 0.095)); 
 
  
 
 float t22=sdBezier(((p*Rot(float(0)))+vec2(float(7.1875)/d,float(31.682644)/d2)),vec2(0.29, 0.022),vec2(0.28, 0.064),vec2(0.278, 0.104)); 
 
  
 
 float t23=sdBezier(((p*Rot(float(0)))+vec2(float(7.4375)/d,float(22.69091)/d2)),vec2(0.29, 0.022),vec2(0.301, 0.064),vec2(0.32, 0.634)); 
 
  
 
 float t24=sdBezier(((p*Rot(float(0)))+vec2(float(-13.4375)/d,float(23.431404)/d2)),vec2(0.364, -0.017),vec2(0.329, 0.064),vec2(0.32, 0.634)); 
 
  
 
 float t25=sdBezier(((p*Rot(float(0)))+vec2(float(-12.25)/d,float(56.330582)/d2)),vec2(0.394, 0.515),vec2(0.337, 0.565),vec2(0.32, 0.634)); 
 
  
 
 float t26=sdBezier(((p*Rot(float(0)))+vec2(float(-11.5625)/d,float(52.839668)/d2)),vec2(0.367, 0.445),vec2(0.322, 0.565),vec2(0.32, 0.634)); 
 
  
 
 float t27=sdBezier(((p*Rot(float(0)))+vec2(float(-10.75)/d,float(53.580162)/d2)),vec2(0.367, 0.445),vec2(0.322, 0.483),vec2(0.308, 0.534)); 
 
  
 
 //#sdf

//float d25= sdBezier(p,vec2(.2,.566),vec2(.640,.415),vec2(.664,.552));


    
    
    //#operacao
	
	col=mix(col,vec4(float(0),float(0),float(0),float(1)), 1.0-smoothstep(0.0,0.01,abs(t))) ; 
 
 
 col=mix(col,vec4(float(0),float(0),float(0),float(1)), 1.0-smoothstep(0.0,0.01,abs(t2))) ; 
 
 
 col=mix(col,vec4(float(0),float(0),float(0),float(1)), 1.0-smoothstep(0.0,0.01,abs(t3))) ; 
 
 
 col=mix(col,vec4(float(0),float(0),float(0),float(1)), 1.0-smoothstep(0.0,0.01,abs(t4))) ; 
 
 
 col=mix(col,vec4(float(0),float(0),float(0),float(1)), 1.0-smoothstep(0.0,0.01,abs(t5))) ; 
 
 
 col=mix(col,vec4(float(0),float(0),float(0),float(1)), 1.0-smoothstep(0.0,0.01,abs(t6))) ; 
 
 
 col=mix(col,vec4(float(0),float(0),float(0),float(1)), 1.0-smoothstep(0.0,0.01,abs(t7))) ; 
 
 
 col=mix(col,vec4(float(0),float(0),float(0),float(1)), 1.0-smoothstep(0.0,0.01,abs(t8))) ; 
 
 
 col=mix(col,vec4(float(0),float(0),float(0),float(1)), 1.0-smoothstep(0.0,0.01,abs(t9))) ; 
 
 
 col=mix(col,vec4(float(0),float(0),float(0),float(1)), 1.0-smoothstep(0.0,0.01,abs(t10))) ; 
 
 
 col=mix(col,vec4(float(0),float(0),float(0),float(1)), 1.0-smoothstep(0.0,0.01,abs(t11))) ; 
 
 
 col=mix(col,vec4(float(0),float(0),float(0),float(1)), 1.0-smoothstep(0.0,0.01,abs(t12))) ; 
 
 
 col=mix(col,vec4(float(0),float(0),float(0),float(1)), 1.0-smoothstep(0.0,0.01,abs(t13))) ; 
 
 
 col=mix(col,vec4(float(0),float(0),float(0),float(1)), 1.0-smoothstep(0.0,0.01,abs(t14))) ; 
 
 
 col=mix(col,vec4(float(0),float(0),float(0),float(1)), 1.0-smoothstep(0.0,0.01,abs(t15))) ; 
 
 
 col=mix(col,vec4(float(0),float(0),float(0),float(1)), 1.0-smoothstep(0.0,0.01,abs(t16))) ; 
 
 
 col=mix(col,vec4(float(0),float(0),float(0),float(1)), 1.0-smoothstep(0.0,0.01,abs(t17))) ; 
 
 
 col=mix(col,vec4(float(0),float(0),float(0),float(1)), 1.0-smoothstep(0.0,0.01,abs(t18))) ; 
 
 
 col=mix(col,vec4(float(0),float(0),float(0),float(1)), 1.0-smoothstep(0.0,0.01,abs(t19))) ; 
 
 
 col=mix(col,vec4(float(0),float(0),float(0),float(1)), 1.0-smoothstep(0.0,0.01,abs(t20))) ; 
 
 
 col=mix(col,vec4(float(0),float(0),float(0),float(1)), 1.0-smoothstep(0.0,0.01,abs(t21))) ; 
 
 
 col=mix(col,vec4(float(0),float(0),float(0),float(1)), 1.0-smoothstep(0.0,0.01,abs(t22))) ; 
 
 
 col=mix(col,vec4(float(0),float(0),float(0),float(1)), 1.0-smoothstep(0.0,0.01,abs(t23))) ; 
 
 
 col=mix(col,vec4(float(0),float(0),float(0),float(1)), 1.0-smoothstep(0.0,0.01,abs(t24))) ; 
 
 
 col=mix(col,vec4(float(0),float(0),float(0),float(1)), 1.0-smoothstep(0.0,0.01,abs(t25))) ; 
 
 
 col=mix(col,vec4(float(0),float(0),float(0),float(1)), 1.0-smoothstep(0.0,0.01,abs(t26))) ; 
 
 
 col=mix(col,vec4(float(0),float(0),float(0),float(1)), 1.0-smoothstep(0.0,0.01,abs(t27))) ; 
 


return col;
}


vec4 body(vec2 p ){
  
	vec4 col=vec4(1.0);
    
 float d=-25.0;
float d2=50.0;

  
float t=sdBezier(((p*Rot(float(0)))+vec2(float(-6.8125)/d,float(33.798344)/d2)),vec2(0.28, 0.359),vec2(0.339, 0.164),vec2(-0.066, 0.077)); 
 
  
 
 float t2=sdBezier(((p*Rot(float(0)))+vec2(float(2.8125)/d,float(34.221489)/d2)),vec2(0.28, 0.359),vec2(0.239, 0.164),vec2(0.6, 0.094)); 
 
  
 
 float t3=sdBezier(((p*Rot(float(0)))+vec2(float(-12.5)/d,float(47.97356)/d2)),vec2(0.162, 0.359),vec2(0.058, 0.308),vec2(0.093, -0.033)); 
 
  
 
 float t4=sdBezier(((p*Rot(float(0)))+vec2(float(13.75)/d,float(47.973553)/d2)),vec2(0.162, 0.37),vec2(0.287, 0.308),vec2(0.268, -0.058)); 
 
  
 
 float t5=sdBezier(((p*Rot(float(0)))+vec2(float(9.1875)/d,float(56.013218)/d2)),vec2(0.181, 0.37),vec2(0.197, 0.308),vec2(0.185, 0.005)); 
 
  
 
 float t6=sdBezier(((p*Rot(float(0)))+vec2(float(-8.1875)/d,float(57.176857)/d2)),vec2(0.181, 0.37),vec2(0.197, 0.308),vec2(0.185, 0.005)); 
 
  
 
 //#sdf

//float d25= sdBezier(p,vec2(.2,.566),vec2(.640,.415),vec2(.664,.552));


    
    
    //#operacao
	
	col=mix(col,vec4(float(0),float(0),float(0),float(1)), 1.0-smoothstep(0.0,0.01,abs(t))) ; 
 
 
 col=mix(col,vec4(float(0),float(0),float(0),float(1)), 1.0-smoothstep(0.0,0.01,abs(t2))) ; 
 
 
 col=mix(col,vec4(float(0),float(0),float(0),float(1)), 1.0-smoothstep(0.0,0.01,abs(t3))) ; 
 
 
 col=mix(col,vec4(float(0),float(0),float(0),float(1)), 1.0-smoothstep(0.0,0.01,abs(t4))) ; 
 
 
 col=mix(col,vec4(float(0),float(0),float(0),float(1)), 1.0-smoothstep(0.0,0.01,abs(t5))) ; 
 
 
 col=mix(col,vec4(float(0),float(0),float(0),float(1)), 1.0-smoothstep(0.0,0.01,abs(t6))) ; 
 
 
    


return col;
}
vec4 rosto(vec2 p ){
  
	vec4 col=vec4(1.0);
    
 
  
    
float d=-25.0;
float d2=50.0;


float t=sdBezier(((p*Rot(float(0)))+vec2(float(-9.5)/d,float(25.547106)/d2)),vec2(0.28, 0.359),vec2(0.339, 0.16),vec2(0.587, 0.077)); 
 
  
 
 float t2=sdBezier(((p*Rot(float(0)))+vec2(float(5.375)/d,float(26.181818)/d2)),vec2(0.286, 0.359),vec2(0.179, 0.16),vec2(0.001, 0.092)); 
 
  
 
 float t3=sdBezier(((p*Rot(float(0)))+vec2(float(0.25)/d,float(29.990082)/d2)),vec2(0.321, 0.359),vec2(0.148, 0.248),vec2(0.075, 0.366)); 
 
  
 
 float t4=sdBezier(((p*Rot(float(0)))+vec2(float(0.1875)/d,float(29.990082)/d2)),vec2(0.198, 0.379),vec2(0.164, 0.412),vec2(0.082, 0.366)); 
 
  
 
 float t5=sdBezier(((p*Rot(float(0)))+vec2(float(2.375)/d,float(29.355373)/d2)),vec2(0.238, 0.343),vec2(0.161, 0.412),vec2(0.117, 0.366)); 
 
  
 
 float t6=sdBezier(((p*Rot(float(0)))+vec2(float(-0.75)/d,float(29.990086)/d2)),vec2(0.357, 0.358),vec2(0.193, 0.317),vec2(0.117, 0.366)); 
 
  
 
 float t7=sdBezier(((p*Rot(float(0)))+vec2(float(3.6875)/d,float(11.583477)/d2)),vec2(0.103, 0.11),vec2(0.051, 0.221),vec2(0.117, 0.366)); 
 
  
 
 float t8=sdBezier(((p*Rot(float(0)))+vec2(float(1.1875)/d,float(11.371902)/d2)),vec2(0.103, 0.11),vec2(0.16, 0.221),vec2(0.117, 0.366)); 
 
  
 
 float t9=sdBezier(((p*Rot(float(0)))+vec2(float(2.9375)/d,float(23.74876)/d2)),vec2(0.06, 0.338),vec2(0.082, 0.312),vec2(0.106, 0.337)); 
 
  
 
 //#sdf

//float d25= sdBezier(p,vec2(.2,.566),vec2(.640,.415),vec2(.664,.552));


    
    
    //#operacao
	
	col=mix(col,vec4(float(0),float(0),float(0),float(1)), 1.0-smoothstep(0.0,0.01,abs(t))) ; 
 
 
 col=mix(col,vec4(float(0),float(0),float(0),float(1)), 1.0-smoothstep(0.0,0.01,abs(t2))) ; 
 
 
 col=mix(col,vec4(float(0),float(0),float(0),float(1)), 1.0-smoothstep(0.0,0.01,abs(t3))) ; 
 
 
 col=mix(col,vec4(float(0),float(0),float(0),float(1)), 1.0-smoothstep(0.0,0.01,abs(t4))) ; 
 
 
 col=mix(col,vec4(float(0),float(0),float(0),float(1)), 1.0-smoothstep(0.0,0.01,abs(t5))) ; 
 
 
 col=mix(col,vec4(float(0),float(0),float(0),float(1)), 1.0-smoothstep(0.0,0.01,abs(t6))) ; 
 
 
 col=mix(col,vec4(float(0),float(0),float(0),float(1)), 1.0-smoothstep(0.0,0.01,abs(t7))) ; 
 
 
 col=mix(col,vec4(float(0),float(0),float(0),float(1)), 1.0-smoothstep(0.0,0.01,abs(t8))) ; 
 
 
 col=mix(col,vec4(float(0),float(0),float(0),float(1)), 1.0-smoothstep(0.0,0.01,abs(t9))) ; 
 
 
 //#cor
    //col = mix(col, vec4(1.0), 1.0-smoothstep(0.0,0.01,abs(d25)));
   
    
    return col;
    
    
}
void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 p = (2.0*fragCoord.xy-iResolution.xy)/iResolution.y;
    p.x+=0.2;
    
    vec2 p1=p;
    p1/=vec2(0.4);
    p1.x-=0.5;
    p1.y-=0.4;
    p1.x=abs(p1.x);
    p1.x-=0.25;
    p1.x=p1.x*-1.0;
    vec4 col=olho(p1);
    col=min(col,rosto(p));
    col=min(col,cabelo(p));
    col=min(col,body(p));
    fragColor=col;
    
    
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
    gl_FragColor.a = 1.;
}