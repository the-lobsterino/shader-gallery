#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

int Stage = 0;
// -----------------------------------
// 		図形		       
// -----------------------------------
//四角形
float sdBox( vec3 p, vec3 b )
{
  vec3 d = abs(p) - b;
  return min(max(d.x,max(d.y,d.z)),0.0) + length(max(d,0.0));
}

float sdBox( vec2 p, vec2 b )
{
  vec2 d = abs(p) - b;
  return min(max(d.x,d.y),0.0) + length(max(d,0.0));
}
float lengthN(vec3 v, float n)
{
  vec3 tmp = pow(abs(v), vec3(n));
  return pow(tmp.x+tmp.y+tmp.z, 1.0/n);
}
//球
float sdSphere( vec3 p, float s )
{
  return length(p)-s;
}
//円柱(縦長)
float sdCappedCylinderX( vec3 p, vec2 h )
{
  vec2 d = abs(vec2(length(p.xz),p.y)) - h;
  return min(max(d.x,d.y),0.0) + length(max(d,0.0));
}
//円柱(横長)
float sdCappedCylinderY( vec3 p, vec2 h )
{
  vec2 d = abs(vec2(length(p.yz),p.x)) - h;
  return min(max(d.x,d.y),0.0) + length(max(d,0.0));
}
// 和集合(基本型)
float Union( float d1, float d2 )
{
    return min(d1,d2);
}
// 差集合(抜く形、抜かれる形)
float Sub( float d1, float d2 )
{
    return max(-d1,d2);
}
// 積集合(重なっている場所のみ描画)
float opI( float d1, float d2 )
{
    return max(d1,d2);
}
// -----------------------------------
// 		乱数		       
// -----------------------------------
float rnd(vec2 p){
    return fract(sin(dot(p ,vec2(12.9898,78.233))) * 43758.5453);
}
vec3 nrand3( vec2 co )
{
	vec3 a = fract( cos( co.x*8.3e-3 + co.y )*vec3(1.3e5, 4.7e5, 2.9e5) );
	vec3 b = fract( sin( co.x*0.3e-3 + co.y )*vec3(8.1e5, 1.0e5, 0.1e5) );
	vec3 c = mix(a, b, 0.5);
	return c;
}
// -----------------------------------
// 		繰り返し		       
// -----------------------------------
vec3 Repeat(vec3 p,float scale)
{
  return mod(p, scale)-scale * 0.5;
	
}
 
vec3 Rotate(vec3 p, float angle, vec3 axis){
    vec3 a = normalize(axis);
    float s = sin(angle);
    float c = cos(angle);
    float r = 1.0 - c;
    mat3 m = mat3(
        a.x * a.x * r + c,
        a.y * a.x * r + a.z * s,
        a.z * a.x * r - a.y * s,
        a.x * a.y * r - a.z * s,
        a.y * a.y * r + c,
        a.z * a.y * r + a.x * s,
        a.x * a.z * r + a.y * s,
        a.y * a.z * r - a.x * s,
        a.z * a.z * r + c
    );
    return m * p;
}

// -----------------------------------
// 		Stage1 		       
// -----------------------------------
float stage1(vec3 p)
{
	    float h = 0.5;//sin(time) + 1.0;
    if(25.0 > time &&time > 14.0) h += (time - 14.0)*0.5;
    if(time > 25.0) Stage = 1;
    float rh = 0.1;
    float grid = 0.5;//0.4;
    float grid_half = grid*0.5;
    float cube = 0.155;
    vec3 orig = p;

    vec3 g1 = vec3(ceil((orig.x)/grid), ceil((orig.y)/grid), ceil((orig.z)/grid));

    p = -abs(p);
    vec3 di = ceil(p/4.8);
    p.y += di.x*1.0;
    p.x += di.y*1.2;
    p.xy = mod(p.xy, -4.8);

    float d1 = p.y + h;
    float d2 = p.x + h;

    vec2 p1 = mod(p.xz, vec2(grid)) - vec2(grid_half);
    float c1 = sdBox(p1,vec2(cube));

    vec2 p2 = mod(p.yz, vec2(grid)) - vec2(grid_half);
    float c2 = sdBox(p2,vec2(cube));

    return max(max(-c1,d1), max(-c2,d2));
}
// -----------------------------------
// 		Stage2 		       
// -----------------------------------
float stage2(vec3 p)
{
	Rotate(p,1.5,vec3(0.5,0.0,0.0));
	float d1 =  lengthN(Repeat(p,1.4), 25.0); - 1.0;
	float d2 =  lengthN(Repeat(p,1.4), 25.0);// - 0.1;
	float d3 = sdCappedCylinderY(Repeat(p,5.4),vec2(2.2,4.5));
	float d4 = sdCappedCylinderX(Repeat(p,5.4),vec2(2.2,4.5));
	return opI(Sub(d1,d3),Sub(d1,d4));// Sub(d1,d2);
	
}
//距離関数
float map(vec3 p)
{
	
	if(Stage == 0)		return stage1(p);
	if(Stage == 1)		return stage2(p);
	
}
// ------------------------------------------------------------------


vec3 genNormal(vec3 p)
{
    const float d = 0.01;
    return normalize( vec3(
        map(p+vec3(  d,0.0,0.0))-map(p+vec3( -d,0.0,0.0)),
        map(p+vec3(0.0,  d,0.0))-map(p+vec3(0.0, -d,0.0)),
        map(p+vec3(0.0,0.0,  d))-map(p+vec3(0.0,0.0, -d)) ));
}

void main(){

    vec2 pos = (gl_FragCoord.xy*2.0 - resolution.xy) / resolution.y;
    vec3 camPos = vec3(-0.5,0.0,3.0);
    vec3 camDir = normalize(vec3(0.3, 0.0, -1.0));
    camPos -=  vec3(0.0,0.0,time*3.0);
    vec3 camUp  = normalize(vec3(0.5, time * 0.5, 0.0));

    vec3 camSide = cross(camDir, camUp);
    float focus = 1.8;
    
    vec3 rayDir = normalize(camSide*pos.x + camUp*pos.y + camDir*focus);	    
    vec3 ray = camPos;
    int march = 0;
    float d = 0.0;

    float total_d = 02.0;
    const int MAX_MARCH = 64;
    const float MAX_DIST = 100.0;
    for(int mi=0; mi<MAX_MARCH; ++mi) {
        d = map(ray);
        march=mi;
        total_d += d;
        ray += rayDir * d;
        if(d<0.001) {break; }
        if(total_d>MAX_DIST) {
            total_d = MAX_DIST;
            march = MAX_MARCH-1;
            break;
        }
    }
	
    float glow = 5.0;

    float glowPos = 1.5;

    float fog = min(1.0, (0.8 / float(MAX_MARCH)) * float(march))*1.0;
    vec3  fog2 = glowPos * vec3(1.0, 1., 1.5) * total_d;
	
	gl_FragColor = vec4(vec3(0.1 , abs(sin(time))/ 1.2 +0.5, abs(sin(time) / 1.2 + 0.8))*fog + -fog2 * glowPos *0.01, 1.0);

}