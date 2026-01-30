#ifdef GL_ES
precision mediump float;
#endif
uniform float time;
uniform vec2 resolution;
#define iTime time
#define iResolution resolution
#define A5
#define PI 3.14159265359
const vec4 iMouse = vec4(0.0);
struct Object
{
    float dist;
    float specVal;
    float specKs;
    float normEps;
    vec3 color;
    vec3 normal;
};

struct MarchRes
{
 	float totalDist;
    vec3 curRay;
    Object obj;
};
    
float sdSphere(vec3 pos, float rad)
{
 	return length(pos) - rad;   
}

float sdRoundedCylinder( vec3 p, float ra, float rb, float h )
{
    vec2 d = vec2( length(p.xz)-2.0*ra+rb, abs(p.y) - h );
    return min(max(d.x,d.y),0.0) + length(max(d,0.0)) - rb;
}

float sdCappedCylinder( vec3 p, float h, float r, float rd)
{
    vec2 d = abs(vec2(length(p.xz),p.y)) - vec2(h,r);
    return min(max(d.x,d.y),0.0) + length(max(d,0.0)) - rd;
}

float sdTorus( vec3 p, vec2 t )
{
    vec2 q = vec2(length(p.xz)-t.x,p.y);
    return length(q)-t.y;
}

mat4 getTransXYZ(float alpha, float beta, float gamma, float x, float y, float z)
{
 	vec4 col =  vec4(cos(beta)*cos(gamma),
                     cos(alpha)*sin(gamma) + sin(alpha)*sin(beta)*cos(gamma),
                     sin(alpha)*sin(gamma) - cos(alpha)*sin(beta)*cos(gamma),
                     0);
    
    vec4 col1 = vec4(-cos(beta)*sin(gamma),
                      cos(alpha)*cos(gamma) - sin(alpha)*sin(beta)*sin(gamma),
                      sin(alpha)*cos(gamma) + cos(alpha)*sin(beta)*sin(gamma),
                      0);
                     
    vec4 col2 = vec4(sin(beta),
                    -sin(alpha)*cos(beta),
                     cos(alpha)*cos(beta),
                     0);
                     
    vec4 col3 = vec4(x, y, z, 1);
                    
    return mat4(col,
                col1,
                col2,
                col3);
    
}

float fmod(float x, float y)
{
 	return x - y * floor(x/y); 
}

float smin( float a, float b, float k )
{
    float h = clamp( 0.5+0.5*(b-a)/k, 0.0, 1.0 );
    return mix( b, a, h ) - k*h*(1.0-h);
}

Object map(vec3 pos)
{
    Object o;
    o.dist = 1000.0;
    o.normEps = 0.0001;
    
    vec3 ballPos = pos;
    ballPos.z = abs(ballPos.z);
                                
    float dBaseBall = sdSphere(ballPos - vec3(0, -2.1, 0.85), 0.16);    
    if(dBaseBall < o.dist)
    {
        o.dist = smin(o.dist, dBaseBall, 0.1);
        o.color = vec3(60.0 / 255.0, 23.0/255.0, 30.0/255.0);
        o.specVal = 55.0;
        o.specKs = 0.5;
        o.normEps = 0.000001;
    }
    
    vec3 ball1Pos = pos;
    ball1Pos.x = abs(ball1Pos.x);
    float dBaseBall1 = sdSphere(ball1Pos - vec3(0.8, -2.1, 0.2), 0.16); 
    if(dBaseBall1 < o.dist)
    {
        o.dist = smin(o.dist, dBaseBall1, 0.1);
        o.color = vec3(60.0 / 255.0, 23.0/255.0, 30.0/255.0);
        o.specVal = 55.0;
        o.specKs = 0.5;
        o.normEps = 0.000001;
    }
    
    vec3 ball2Pos = pos;
    ball2Pos.x = abs(ball2Pos.x);
    ball2Pos.z = abs(ball2Pos.z);
    float dBaseBall2 = sdSphere(ball2Pos - vec3(0.5, -2.1, 0.66), 0.16);
    
    if(dBaseBall2 < o.dist)
    {
        o.dist = smin(o.dist, dBaseBall2, 0.1);
        o.color = vec3(60.0 / 255.0, 23.0/255.0, 30.0/255.0);
        o.specVal = 55.0;
        o.specKs = 0.5;
        o.normEps = 0.000001;
    }
    float dTubeBase = sdCappedCylinder(pos - vec3(0, -2.26, 0), 1.1, 0.15, 0.02);
    float dTubeBaseBtm = sdCappedCylinder(pos - vec3(0, -2.55, 0), 2.0, 0.15, 0.03);
    float dTubeBaseRing = sdTorus(pos - vec3(0, -2.445, 0), vec2(1.65, 0.1));
    dTubeBase = smin(dTubeBaseBtm, dTubeBase, 0.02);
    dTubeBase = smin(dTubeBase, dTubeBaseRing, 0.01);
    if(dTubeBase < o.dist)
    {
        o.dist = dTubeBase;
        o.color = vec3(23.0 / 255.0, 23.0/255.0, 30.0/255.0);
        o.specVal = 10.0;
        o.specVal = 2.5;
        o.specKs = 0.5;
        o.normEps = 0.000001;
    }

    vec3 pipePos = pos;
    pipePos.x = abs(pipePos.x);
    float dPipeBound = sdSphere(pipePos - vec3(1.8, -3., 1.8), 1.0);    
    if(dPipeBound < o.dist)
    {

        float ang = PI/2.0;
        vec2 col1 = vec2(cos(ang), sin(ang));
        vec2 col2 = vec2(-sin(ang), cos(ang));
        mat2 rotMat = mat2(col1, col2);

        vec2 col3 = vec2(cos(-ang/2.0), sin(-ang/2.0));
        vec2 col4 = vec2(-sin(-ang/2.0), cos(-ang/2.0));
        mat2 rotMat1 = mat2(col3, col4);

        pipePos = vec3(pipePos.x, rotMat * pipePos.yz);
        pipePos = vec3(rotMat1 * pipePos.xy, pipePos.z);


        float dPipe = sdCappedCylinder(pipePos - vec3(-0.2,-2.9,-2.8), 0.3, 0.91, 0.02);
        if(dPipe < o.dist)
        {
            o.dist = smin(o.dist , dPipe, 0.02);
            o.color = vec3(23.0 / 255.0, 23.0/255.0, 30.0/255.0);
            o.specVal = 10.0;
            o.specVal = 5.5;
            o.specKs = 0.5;
            o.normEps = 0.0001;
        }
    }

    
    float dSphereBound = sdSphere(pos-vec3(0,-1.,0), 1.3);
    if(dSphereBound < o.dist)
    {
 
        vec3 spherePos = vec3(getTransXYZ(0., iTime/2.0, .0, .0, .0, .0) * vec4(pos, 1));

        float xMod = 0.12*cos(iTime/2.0)*sin(12.0*spherePos.y)*sin(12.0*spherePos.x)*sin(12.0*spherePos.z);
        float yMod = 0.12*cos(iTime/2.0)*cos(spherePos.y)*sin(10.0*spherePos.x)*sin(10.0*spherePos.z);
        float zMod = 0.12*(cos(iTime/2.0))*sin(10.0*spherePos.y)*sin(10.0*spherePos.x)*sin(9.0*spherePos.z);

        spherePos = vec3(getTransXYZ(0., 1.5*iTime, .0, .0, .0, .0) * vec4(spherePos, 1));
        spherePos = (spherePos - vec3(.0, -1.1, .0) - vec3(xMod, yMod, zMod));

        float dSphere = sdSphere(spherePos, 1.0);

        if(dSphere < o.dist)
        {
            o.dist = dSphere;
            o.color = vec3(.1, 0.5, .1);
            o.specVal = 50.0;
            o.specKs = 1.0;
            o.normEps = 0.0001;
        }      
    }
    

    
    return o;
}

vec3 calcNorm(vec3 pos, float eps)
{
    float ep = min(0.0001, eps);
 	float x = map(pos + vec3(ep, .0, .0)).dist - map(pos - vec3(ep, .0, .0)).dist;
    float y = map(pos + vec3(.0, ep, .0)).dist - map(pos - vec3(.0, ep, .0)).dist;
   	float z = map(pos + vec3(.0, .0, ep)).dist - map(pos - vec3(.0, .0, ep)).dist;
    return normalize(vec3(x,y,z));
}

float calcLight(vec3 pos, vec3 lightDir)
{
    return dot(pos, lightDir);
}

MarchRes marchRays(vec3 pos, vec3 dir)
{
    MarchRes res;
    Object o;
    float totalDist = 0.001;
    vec3 curRay = pos;
    for(int x=0; x<100; x++)
    {
        curRay = pos + (dir*totalDist);
     	o = map(curRay);
        
        if(abs(o.dist) < 0.0002)
            break;
        if(totalDist > 20.0)
            break;
        
        totalDist += o.dist*0.85;
    }
    
    res.totalDist = totalDist;
    res.curRay = curRay;
    res.obj = o;

    if(totalDist <= 20.0)
        res.obj.normal = calcNorm(curRay, res.obj.normEps);
    
    return res;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 uv = (2.0*fragCoord - iResolution.x)/iResolution.y;
	vec3 camEye = vec3(0, 0.0, 3.2 + -0.5*sin(iTime/3.0));
    vec3 dir = vec3(uv, -1);
    dir = normalize(dir);
    
    vec3 light = vec3(0, 10, 10);
    vec3 lightBlob = vec3(1., -0.5, 0.);
    float lightTime = fmod(iTime, 7.0);
    float lightInt = 2.7 + fract(lightTime*lightTime / 3.0);
    float lightBlobInt = 2.0;
    vec3 lightCol = vec3(0.4,0.55,0.4);;
    vec3 lightBlobCol = vec3(0., 0.2, 0);
    
    MarchRes res = marchRays(camEye, dir);
    vec3 col = vec3(0);
    if(res.totalDist < 20.0)
    {
        vec3 pos = res.curRay;
        
        float lightShadow = step(20.0, marchRays(pos, normalize(light)).totalDist);
        vec3 lightDif = lightCol * clamp(calcLight(res.obj.normal, normalize(light - pos)), 0.0, 1.0) * lightInt;
        vec3 lightSpecR = 2.0 * 
            clamp(dot(res.obj.normal, normalize(light-pos)), 0.0, 1.0) 
            * res.obj.normal - normalize(light-pos);
        
        float lightSpec = clamp(dot(normalize(camEye-pos), lightSpecR), 0.0, 1.0);
        
        vec3 lightBlobFinal = lightBlobCol * clamp(calcLight(res.obj.normal, normalize(lightBlob - pos)), .0, 1.) * lightBlobInt;
        col = res.obj.color * (lightCol*lightDif) * lightShadow;
        col += lightInt*(lightCol*pow(lightSpec, res.obj.specVal))*res.obj.specKs * lightShadow;
        
    }
    fragColor = vec4(col,1.0);
}


void main(void)
{
//iMouse = vec4(mouse * resolution, 0.0, 0.0);    
mainImage(gl_FragColor, gl_FragCoord.xy);
gl_FragColor.a = 1.0;
}