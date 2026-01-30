// --=by shellderr '23=--
precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
#define res resolution
#define max_steps 56
#define min_step .01
#define epsilon .016
#define dist_margin 1.
#define num 10
vec3 balls[10];

mat3 rot(float t){
  return mat3(cos(t), 0, sin(t), 0, 1, 0, -sin(t), 0, cos(t));
}

vec3 ball(float t){
	return .7*vec3(sin(t*1.2)*cos(t*.82), cos(6.+t*.9)*sin(9.+t*1.15), sin(12.+t*.7)*cos(22.+t*1.33));

}

float smin( float a, float b, float k ){
    float h = max( k-abs(a-b), 0.0 )/k;
    return min( a, b ) - h*h*k*(1.0/4.0);
}

float sdBox(vec3 v, vec3 p, float b){
  vec3 d = abs(v-p) - b;
  return min(max(d.x,max(d.y,d.z)),0.0) + length(max(d,0.0));
}

vec3 bkg(vec2 v, float t){
   return v.xyx*cos(t+vec3(1,2,3))*.5+.5;   
}

void update(float t){
  for(int i = 0; i < num; i++){
    float f = float(i+1);
    balls[i] = ball(f*88.+t);
  }
}

float meta(vec3 p){
   float f = 1.;
   for(int i = 0; i <num; i++){
     f = smin(length(2.4*mouse.y*balls[i]-p),f, .5);
   }
   return f - .24;
}


float map(vec3 v){
   return meta(v);
}

// iquilezles.org/articles/normalsSDF
vec3 normal(vec3 p){
    const float h = 0.0001; 
    const vec2 k = vec2(1,-1);
    return normalize(
       k.xyy*map(p + k.xyy*h)+ 
       k.yyx*map(p + k.yyx*h)+ 
       k.yxy*map(p + k.yxy*h)+ 
       k.xxx*map(p + k.xxx*h));
}

vec3 light(vec3 p, vec3 l, vec3 c, float a){
   float ll = clamp(dot(normalize(l),normal(p)),.0,1.);
   return pow(ll,a)*c;
}

vec3 fresnel(vec3 r, vec3 l, vec3 c){
 float n = clamp(dot(normalize(l),normal(r)),0.,1.);
 float f =  pow(1.- n,3.);
 //return  c*pow((sin(f*2.)*.5+.5),2.);
 return c*f;
}

vec3 lights(vec3 r){
		vec3 lv = vec3(.2, cos(4.+time*.6),-.7);
  vec3 lv2 = vec3(-.2, cos(time*.6),-.7);
  vec3 lv3 = vec3(-.1, -.01,-.1); 
  vec3 lc = vec3(0, .5,.4);
  vec3 lc2 = vec3(.7,.7,0.);  
  vec3 lc3 = vec3(.9,.0,.6);  
  vec3 l = light(r,lv,lc, 222.);
  vec3 l2 = light(r,lv2,lc2, 222.);
  vec3 l3 = light(r,lv2,lc3, 3.);  
  vec3 lf = vec3(-.01,.0,-1.);
  vec3 cf = vec3(.4,.6,1.);
  vec3 f = fresnel(r,lf,cf);
  vec3 ll = vec3(.0,.0,.7)*.1+.7*(l+l2+l3);
  return ll+f*.75;
	//	return vec3(.0,.0,.6)*.2+.7*(l+l2+l3);      
}

vec3 trace(vec3 o, vec3 d, vec2 uv){
	float t = .5;
 vec3 r = o+d*1.4;
 float dist = map(vec3(1.6*r.xy,-.5));
 float m = (1.-dist*1.3)*.4;
	for(int i = 1; i < max_steps; i++){
  r = o+d*t;
		dist = map(r);
		if(dist < epsilon){
	   return lights(r);// + vec3(.4,.6,1)*m*.7;
		}
		t+= dist*dist_margin;
	}
	return bkg(uv,time); //vec3(.4,.6,1)*m*.9; //(cos(time*3.+3.+m*6.)*.3+.3);  //bkg(uv,time);
}

void main(void){
	vec2 uv = .7*(2.*gl_FragCoord.xy-res)/res.y;
	vec3 dir = normalize(vec3(uv, 1));
	vec3 pos = vec3((mouse-.5)*0.,-2.2);
 update(time*1.1);
	vec3 c = trace(pos, dir, uv);
	gl_FragColor = vec4(1.25*c,1);

}