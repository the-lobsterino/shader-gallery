#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
#define MAX_DIST 40.0
#define MIN_DIST 0.001
#define MAX_STEPS 512

#define PI 3.14159265358979323846264

float hash(vec2 p) {
	p = fract(p*vec2(931.733,354.285));
	p += dot(p,p+39.37);
	return fract(p.x*p.y);
}

float sdRoundBox( vec3 p, vec3 b, float r ) {
  vec3 d = abs(p) - b;
  return length(max(d,0.0)) - r
         + min(max(d.x,max(d.y,d.z)),0.0);
}

float do_model( vec3 p )
{
    vec3 idx = vec3(floor(abs(p.xz - 0.5)), 0.5);
	  p.xz = mod(p.xz + 0.5, 1.) - 0.5;
    float h = sin(length(idx.xy * 0.5) +time * 1.25) * 1.5;
    vec3 move = vec3(0.,h,0.);
    
  
    vec3 mp = vec3(p.x,abs(1.0 - p.y),p.z);
    float d = sdRoundBox(mp-move, vec3(0.25),.01);

    return d;
} 

vec2 map( in vec3 p ) {
    vec3 q=p;
    float m =1.;
    float d = do_model(q);

    return vec2(d,m);
}    

vec3 get_normal( in vec3 pos ) {
    vec2 e = vec2(.00001,0.);
    return normalize(
        vec3(map(pos+e.xyy).x-map(pos-e.xyy).x,
             map(pos+e.yxy).x-map(pos-e.yxy).x,
             map(pos+e.yyx).x-map(pos-e.yyx).x
             )
        );
}

float soft_shadow( in vec3 ro, in vec3 rd, float mint, float k ) {
    float res = 1.0;
    float t = mint;
    for( int i=1; i<50; i++ ) {
      float h = map(ro + rd*t).x;
      res = min( res, smoothstep(0.0,1.0,k*h/t) );
		  t += clamp( h, 0.01, 0.25 );
		  if( res<0.005 || t>10.0 ) break;
    }
    return clamp(res,0.0,1.0);
}

/** intersection function **/
vec2 ray( in vec3 ro, in vec3 rd ) {
    float m = -1.;
    float t = 0.01;
    for (int i = 0; i<MAX_STEPS;i++)
    {
     	vec3 pos = ro + t * rd;
        
        vec2 h = map(pos);
        m = h.y;
        if(abs(h.x)<(0.001*t)) 
            break;
       	t += h.x * 0.2;
        if(t>MAX_DIST)
            break;
    }
    if(t>MAX_DIST) m=-1.;
    
    return vec2(t,m);
}

vec2 rotate(vec2 p, float t) {
  return p * cos(t) + vec2(p.y, -p.x) * sin(t);
}

mat3 get_camera(vec3 rayorigin, vec3 ta, float rotation) {
	vec3 cw = normalize(ta-rayorigin);
	vec3 cp = vec3(sin(rotation), cos(rotation),0.0);
	vec3 cu = normalize( cross(cw,cp) );
	vec3 cv = normalize( cross(cu,cw) );
	return mat3( cu, cv, cw );
}

void main()
{
    vec2 uv = (2.*gl_FragCoord.xy-resolution.xy)/resolution.y;
    float an = 5.*mouse.x/resolution.x;

    vec3 ro = vec3(0.,3.25,-13.);
    vec3 target = vec3(0.);
    mat3 cameraMatrix = mat3(0.);
    vec3 rd = vec3(0.);
  
    float fstop = -(time * 0.1);
    ro.xz = rotate(ro.xz, fstop);
    rd.xz = rotate(rd.xz, fstop);
  
    float d = 0.; 
  
    float zm = (5.5+ sin(time * .3) * 4.5);
    float zoomLevel = zm;
    target.y += (zm * .25);
      
    cameraMatrix = get_camera(ro, target, 0. );
    rd = cameraMatrix * normalize( vec3(uv.xy, zoomLevel) );

    vec3 fdcolor = vec3(.3,.5,.75);
    // sky dome
    vec3 col = fdcolor;
    // sky horizon
    //col = mix( col, vec3(.15,.1,.9), exp(-10.0*max(rd.y,1.0)) ); 
  
    vec2 tm = ray(ro, rd);

    if(tm.y>0.)
    {
        float t = tm.x;
        float m = tm.y;
        
        vec3 pos = ro + t * rd;
        vec3 nor = get_normal(pos);
        
        vec3 mate = vec3(.12);

        vec3 sun_direct = normalize(vec3(0.7,.4,.2));
 
        float sun_dif = clamp( dot(nor,sun_direct),0.,1.);
        float sky_shadow = soft_shadow(pos, sun_direct,.7,5.1);
        float sky_dif = clamp( .5 + .5 * dot(nor,vec3(0.,1.,0.)), 0.,1.);
        float bnc_dif = clamp( .5 + .5 * dot(nor,vec3(0.,-1.,0.)), 0.,1.);
        
        vec3 lin = vec3(0.);
        lin += vec3(6.,4.,3.)*sun_dif * sky_shadow;
        lin += vec3(.3,.8,.9)*sky_dif;
        lin += vec3(.3,.3,.2)*bnc_dif;
        
        col = mate * lin;
        //smooth far back//
        col = mix( col,fdcolor, 1.-exp(-0.0001*t*t*t));
    }
    
    col = pow(col, vec3(0.4545));
    gl_FragColor = vec4(col,1.0);
}
