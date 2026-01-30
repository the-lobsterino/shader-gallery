precision mediump float;

uniform vec2  resolution;
uniform vec2  mouse;
uniform float time;

vec2 m = vec2(mouse.x * 2.0 - 1.0, mouse.y * 2.0 - 1.0);
vec3 mu = vec3(3.*m[0],m[1]*resolution.y/resolution.x,0);
//カメラの位置
vec3 cPos         = vec3(0.0,  0.0,  5.0);
// カメラの向き(視線)
vec3 cDir         = vec3(0.0,  0.0, -1.0);
// カメラの上方向
vec3 cUp          = vec3(0.0,  1.0,  0.0);
vec3 cSide        = cross(cDir, cUp);
float targetDepth = 1.0;
vec3 ray2 = normalize(cSide*m[0]*resolution.x/resolution.y+cUp*m[1]+cDir*targetDepth);
//球の中心
vec3 mu2 = cPos - (cPos[2]/ray2[2])*ray2; 
//光源の位置
vec3 l = vec3(5.,5.,5.);

//二次方程式を解く
float solve_quad(float a, float b, float c){
	float d = b*b-4.*a*c;
	if(d < 0.){
	return -1000.;}
	else
	return (-b-sqrt(d))/2.*a;
}
//シェーディング
vec3 doColor(vec3 p){
    float e = 0.001;
    if (length(p-mu2)-1.<e){
        vec3 normal = p-mu2;
        float diff  = (500.*dot((l-p),normal)/(4.*3.14*pow((distance(l,p)),2.)))/3.14;
        return vec3(diff, diff, diff);
    }
    return vec3(0.0);
}

void main(){
    vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);

    vec3 ray = normalize(cSide * p.x + cUp * p.y + cDir * targetDepth);
   
    float dist = 0.0;
    
    float ans = solve_quad(dot(ray,ray),2.*dot(ray,cPos-mu2),dot(cPos-mu2,cPos-mu2)-1.);
    if(ans < 0.){
      vec3 color = vec3(0.0);
      gl_FragColor = vec4(color, 1.0);
    }
    else{
      vec3 rPos = cPos + ans * ray;
      vec3 color = doColor(rPos);
      gl_FragColor = vec4(color, 1.0);
   }
}