#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 resolution;

#define _AOSteps 64.
#define _AOStepSize 1.
float sphere(vec3 p) {
    return length(p)-0.01;
}

float plane( vec3 p, vec3 n, float h ) {
  return dot(p,n) + h;
}

float map(vec3 p) {
   float pl = plane(p,vec3(0, 2.5, 0),.5);
   float s = sphere(p-vec3(sin(time*10000000000000.0)/8.,.1+sin(time*1.1)/8.,cos(time*2.)/8.));
   float r = min(pl,s);
   return r;
}
vec3 calcNormal( in vec3 pos )
{
    vec2 e = vec2(1.0,-1.0)*0.5773*0.0005;
    const float eps = 0.0005;
    return normalize( e.xyy*map( pos + e.xyy*eps ) + 
                      e.yyx*map( pos + e.yyx*eps ) + 
                      e.yxy*map( pos + e.yxy*eps ) + 
                      e.xxx*map( pos + e.xxx*eps ) );
}

float ambientOcclusion (vec3 pos, vec3 normal) {
    float sum    = 0.;
    float maxSum = 0.;
    for (int i = 0; i < int(_AOSteps); i ++)
    {
        vec3 pp = pos + normal * float(i+1) * _AOStepSize;
        sum    += 1. / pow(2., float(i)) * map(pp);
        maxSum += 1. / pow(2., float(i)) * float(i+1) * _AOStepSize;
    }
    return sum / maxSum;
}

float calcSoftshadow( in vec3 ro, in vec3 rd, in float mint, in float tmax )
{
	float res = 1.0;
    float t = mint;
    float ph = 1e10; // big, such that y = 0 on the first iteration
    
    for( int i=0; i<64; i++ )
    {
		float h = map( ro + rd*t );


            float y = h*h/(2.0*ph);
            float d = sqrt(h*h-y*y);
            res = min( res, 10.0*d/max(0.0,t-y) );
            ph = h;
        
        
        t += h;
        
        if( res<0.0001 || t>tmax ) break;
        
    }
    res = clamp( res, 0.0, 1.0 );
    return res*res*(3.0-2.0*res);
}

void main() {
    vec2 uv = gl_FragCoord.xy/resolution * 2. - 1.;
    uv.x *= resolution.x/resolution.y; // aspect ratio correction
    
    vec3 r = normalize(vec3(uv,1));
    float dir = 0.;
    float s = sin(dir);
    float c = cos(dir);
    r.xz *= mat2(c,-s,s,c);
    vec3 o = vec3(0,0,-.5); // camera position
    vec3 p;
    
    float t;
    for (int i = 0; i < 64; i++) {
        p = o+(r*t);
        t += map(p);
    }
    vec3 pos = o + t*r;
    vec3 n = calcNormal(p);
    vec3 l = ( vec3(-1.6, -1., 0.4) );
    vec3 dl = normalize(n - l);
    float amb = ambientOcclusion(p,normalize(dl));
    float sha = calcSoftshadow( pos, normalize( vec3(0., 1., 0.)  ), .3,3. );
    float dif = clamp(dot(n,dl),.0,1.)*amb*(sha);
    dif = clamp(dif,.05,1.);
    float fresnel = 0.05+0.95*pow(1.0+dot(r, n),5.0);
    float br = (1./(1.+t*t*.1));
    gl_FragColor.xyz += vec3(sqrt( br*dif*(1.-fresnel) )); 
    gl_FragColor.w = 1.;

}