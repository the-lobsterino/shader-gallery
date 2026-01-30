precision mediump float;
uniform float time;
uniform vec2  mouse;
uniform vec2  resolution;

 vec3 cPos = vec3(0.0,  -2.0,  2.0);
 vec3 cDir = vec3(0.0, 0.0, -1.0);
 vec3 cUp  = vec3(0.0, 1.0, 0.0);
 vec3 lightDir = vec3(0.0, 0.0, 1.0);

vec3 foldX(vec3 p) {
    p.x = abs(p.x);
    return p;
}


//カメラの回転Y
mat3 y_axis_rot(float angle){
    float c = cos(angle);
    float s = sin(angle);
    return mat3(c, 0.0, s, 0.0, 1.0, 0.0, -s, 0.0,  c);
}


mat2 rotate(float a) {
    float s = sin(a),c = cos(a);
    return mat2(c, s, -s, c);
}

float smoothMin(float d1, float d2, float k){
    float h = exp(-k * d1) + exp(-k * d2);
    return -log(h) / k;
}

float sdSphere( vec3 p, float s )
{
  return length(p)-s;
}

float dSphere(vec3 p) {
    float size = 0.5;
    float d = sdSphere(p, size);
    for(float i = 0.0; i<2.0; i++){
    vec3 q = foldX(p);
    q.xy -= vec2(abs(sin(time)*0.4*i),-abs(sin(time)*5.0));
    d = smoothMin(d, sdSphere(p, 0.4-i*0.1), 3.0);
    p=q;
    }
    return d;
}


vec3 getNormal(vec3 p){
    float d = 0.001;
    return normalize(vec3(
        dSphere(p + vec3(  d, 0.0, 0.0)) - dSphere(p + vec3( -d, 0.0, 0.0)),
        dSphere(p + vec3(0.0,   d, 0.0)) - dSphere(p + vec3(0.0,  -d, 0.0)),
        dSphere(p + vec3(0.0, 0.0,   d)) - dSphere(p + vec3(0.0, 0.0,  -d))
    ));
}

void main(void){
    // fragment position
    vec2 p = ((gl_FragCoord.xy / vec2(sqrt(2.0)/2.0,0.5)) - vec2((sqrt(2.0)/2.0)*resolution.x,resolution.y/2.0)) / min(resolution.x, resolution.y);
    
    // camera
    //cPos*=y_axis_rot(time);
    //cDir*=y_axis_rot(time);
    //cUp *=y_axis_rot(time);
    //lightDir *= y_axis_rot(time);
    
    vec3 cSide = cross(cDir, cUp);
    float targetDepth = 0.5;
    
    // ray
    vec3 ray = normalize(cSide * p.x + cUp * p.y + cDir * targetDepth);
    
    // marching loop
    float distance = 0.0; // レイとオブジェクト間の最短距離
    float rLen = 0.0;     // レイに継ぎ足す長さ
    vec3  rPos = cPos;    // レイの先端位置
    for(int i = 0; i < 128; i++){
        distance = dSphere(rPos);
        rLen += distance;
        rPos = cPos + ray * rLen;
    }
    
    // hit check
    if(abs(distance) < 0.001){
        vec3 normal = getNormal(rPos);
        float diff = clamp(dot(lightDir, normal), 0.1, 1.0);
        gl_FragColor = vec4(vec3(diff)*vec3(0.8,0.8,1.2), 1.0);
    }else{
        gl_FragColor = vec4(vec3(0.0), 1.0);
    }
}