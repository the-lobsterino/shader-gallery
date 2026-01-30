//  testing with Jonas

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

//Raymarching Distance Fields
//About http://www.iquilezles.org/www/articles/raymarchingdf/raymarchingdf.htm
//Also known as Sphere Tracing
//Original seen here: http://twitter.com/#!/paulofalcao/statuses/134807547860353024

//Util Start
vec2 ObjUnion(in vec2 obj_floor,in vec2 obj_roundBox){
  if (obj_floor.x<obj_roundBox.x)
  	return obj_floor;
  else
  	return obj_roundBox;
}
//Util End


//Sphere
float sphere(in vec3 p, float radius){
	float length = sqrt(p.x*p.x + p.y*p.y + p.z*p.z);
	return length-radius;
}

//Floor
vec2 obj_floor(in vec3 p){
  return vec2(p.y+3.0,0);
}

vec2 fblob(vec3 p) {
	// This is what I more or less recommend to use (TOP SECRET CODE FROM MERCURY - USE WITH CAUTION)
	float l = length(p);
	p = abs(normalize(p));
	p = mix(mix(p.zxy, p.yzx, step(p.z, p.y)), p, step(p.y, p.x) * step(p.z, p.x));
	float b = max(
		max(dot(p,vec3(.577)),
			dot(p.xz,vec2(.526,.851))), // <--- seems to be necessary (try specular reflections without it)
		max(dot(p.xz,vec2(.934,.357)),
			dot(p.xy,vec2(.851,.526))));
	// Three lines full of magic to play with:
	b = acos(b-0.01) / (3.1415*.9);
	b = smoothstep(.7, 0.0, b);
	return vec2(l - 2.0 - b * b * .8, 1);
	// las/mercury - END OF TRANSMISSION - <3
}

//Floor Color (holodeck)
vec3 obj_floor_c(in vec3 p){
 if ((fract(p.x*.5)>.94) || (fract(p.z*.5)>.94))
     return vec3(1.0, 0.7, 0.2);
   else
     return vec3(0.05, 0.07, 0.1);
}

//IQs RoundBox (try other objects http://www.iquilezles.org/www/articles/distfunctions/distfunctions.htm)
vec2 obj_roundBox(in vec3 p){
  return vec2(length(max(abs(p)-vec3(1,1,1),0.0))-0.25,1);
}

vec2 obj_sphere(in vec3 p){
  return vec2(length(p)-2.0);
}

//RoundBox with simple solid color
vec3 obj_roundBox_c(in vec3 p){
	p = abs(normalize(p));
	p = mix(mix(p.zxy, p.yzx, step(p.z, p.y)), p, step(p.y, p.x) * step(p.z, p.x));
	float b1 = dot(p,vec3(.577));
	float b2 = dot(p.xz,vec2(.526,.851));
	float b3 = dot(p.xz,vec2(.934,.357));
	float b4 = dot(p.xy,vec2(.851,.526));

	bool b12 = (b1 < b2);
	bool b34 = (b4 < b3);
	bool b14 = max(b1, b2) < max(b3, b4);
	if (b34 && b14) {
		return vec3(1);
	}
	else if (!(b12 || b14)) {
		return vec3(1);
	}
	else {
		return vec3(0);
	}
	//return vec3((b1 < b2) ? 1.0 : 0.0, (b4 < b3) ? 1.0 : 0.0, (max(b1, b2) < max(b3, b4)) ? 1.0 : 0.0);
}
//Objects union
vec2 inObj(in vec3 p){
  return ObjUnion(obj_floor(p),fblob(p));
}

void ball(vec4 otherColor) {
  //Camera animation
  vec3 U=vec3(0,1,0);//Camera Up Vector
  vec3 viewDir=vec3(0,0,0); //Change camere view vector here
  float spin = time * 0.1 + mouse.x * 8.0;
  vec3 E=vec3(-sin(spin)*4.0, 8.0 * mouse.y, cos(spin)*4.0); //Camera location; Change camera path position here
	
  //Camera setup
  vec3 C=normalize(viewDir-E);
  vec3 A=cross(C, U);
  vec3 B=cross(A, C);
  vec3 M=(E+C);
  
  vec2 vPos=2.0*gl_FragCoord.xy/resolution.xy - 1.0; // (2*Sx-1) where Sx = x in screen space (between 0 and 1)
  vec3 scrCoord=M + vPos.x*A*resolution.x/resolution.y + vPos.y*B; //normalize resolution in either x or y direction (ie resolution.x/resolution.y)
  vec3 scp=normalize(scrCoord-E);

  //Raymarching
  const vec3 e=vec3(0.001,0,0); // normal fix - las
  const float MAX_DEPTH=60.0; //Max depth

  vec2 s=vec2(0.1,0.0);
  vec3 c,p,n;

  float f=1.0;
  for(int i=0;i<256;i++){
    if (abs(s.x)<.01||f>MAX_DEPTH) break;
    f+=s.x;
    p=E+scp*f;
    s=fblob(p);
  }
  
  if (f<MAX_DEPTH){
    float b = 0.0;
	  if (s.y==0.0)
      c=vec3(0.0,0.0,0.0);
	  else {
           c=obj_roundBox_c(p);
    n=normalize(
      vec3(s.x-inObj(p-e.xyy).x,
           s.x-inObj(p-e.yxy).x,
           s.x-inObj(p-e.yyx).x));
    b=dot(n,normalize(E-p));
	}
    gl_FragColor=vec4((b*c+pow(b,8.0))*(1.0-f*.01),1.0);//simple phong LightPosition=CameraPosition
  }
  else gl_FragColor=otherColor; //background color
}



vec2 hash22(vec2 p) { 
    float n = sin(dot(p, vec2(41, 289)));
    return fract(vec2(262144, 32768)*n); 
}

float Voronoi(vec2 p)
{	
    vec2 ip = floor(p);
    p = fract(p);

    float d = 1.;
    
    for (float i = -1.; i < 1.1; i++){
	    for (float j = -1.; j < 1.1; j++){
     	    vec2 cellRef = vec2(i, j);
            vec2 offset = hash22(ip + cellRef);
            vec2 r = cellRef + offset - p; 
            float d2 = dot(r, r);
            d = min(d, d2);
        }
    }
    
    return sqrt(d); 
}

void main(void){
    vec2 uv = (gl_FragCoord.xy - resolution.xy*.5)/resolution.y;
    float t = time, s, a, b, e;
    float th = sin(time*0.01)*sin(time*0.13)*4.;
    float cs = cos(th), si = sin(th);
    uv *= mat2(cs, -si, si, cs);
    vec3 sp = vec3(uv, 0);
    vec3 ro = vec3(0, 0, -1);
    vec3 rd = normalize(ro-sp);
    vec3 lp = vec3(cos(time*.1)*0.375, sin(time*.1)*0.1, -1.);
    const float L = 9.;
    const float gFreq = 0.4;
    float sum = 0.;
    th = 3.14159265*0.7071/L;
    cs = cos(th), si = sin(th);
    mat2 M = mat2(cs, -si, si, cs);
    vec3 col = vec3(0);
    float f=0., fx=0., fy=0.;
    vec2 eps = vec2(4./resolution.y, 0.);
    vec2 offs = vec2(0.1);
    
	
    fx = (mouse.x - 1.0) / 20.0;
    fy = (mouse.y - 1.0) / 20.0;

    for (float i = 0.; i<L; i++){
        s = fract((i - time - t*0.001)/L);
        e = exp2(s*L)*gFreq;
        a = (1.-cos(s*6.283))/e;
        f += Voronoi(M*sp.xy*e + offs) * a;
        fx += Voronoi(M*(sp.xy+eps.xy)*e + offs) * a;
        fy += Voronoi(M*(sp.xy+eps.yx)*e + offs) * a;
        sum += a;
        M *= M;
    }

    sum = max(sum, 0.001);
    f /= sum;
    fx /= sum;
    fy /= sum;
    float bumpFactor = 0.2;
    fx = (fx-f)/eps.x;
    fy = (fy-f)/eps.x;
    vec3 n = normalize( vec3(0, 0, -1) - vec3(fx, fy, 0)*bumpFactor );           
    vec3 ld = lp - sp;
    float lDist = max(length(ld), 0.001);
    ld /= lDist;
    float atten = min(1./(lDist*0.75 + lDist*lDist*0.15), 1.);
    float diff = max(dot(n, ld), 0.);  
    diff = pow(diff, 2.)*0.66 + pow(diff, 4.)*0.34; 
    float spec = pow(max(dot( reflect(-ld, n), rd), 0.), 8.); 
    vec3 objCol = vec3(f*0.5, f*f*sqrt(f)*0.75+cos(time*0.15), f*sqrt(f)*2.0*0.75+cos(time*0.3));
    col = (objCol * (diff + 0.5) + vec3(1.0, 1.0, 1.0)*spec) * atten;
    vec4 col2 = vec4(min(col, 1.), 1.);
	
    ball(col2);
}
