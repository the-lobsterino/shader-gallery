#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


const int seq = 1;

float bits(int n) {
	return 0.;
	//return float((seq>>n)&1);
}


void pR(inout vec2 p, float a)
{
	a *= 6.283;
	p = cos(a)*p+sin(a)*vec2(p.y, -p.x);
}


vec3 rep(vec3 p, float r)
{
	return (fract(p/r-.5)-.5)*r;
}

float sat(float x)
{
	return clamp(x, 0., 1.);
}


float map(vec3 p){
	
	//p = rep(p,2.0);
	
	float d = length(p) - 0.5;
	return d;
}

vec3 normal( in vec3 p) {
    vec2 e = vec2(1.0,-1.0)*0.5773*0.0005;
    return normalize(e.xyy * map(p + e.xyy) + e.yyx * map(p + e.yyx) + e.yxy * map(p + e.yxy) + e.xxx * map(p + e.xxx));
}

float shadow( in vec3 ro, in vec3 rd){
	float res = .0;
    	float t = .05;
	float h;	
    	for (int i = 0; i < 4; i++)
	{
		h = map( ro + rd*t );
		res = min(6.0*h / t, res);
		t += h;
	}
    return max(res, 0.0);
}

float calcAO(const vec3 pos,const vec3 nor) {
    float aodet = 0.002 * 1.1;
    float totao = 0.0;
    float sca = 10.0;
    for (int aoi = 0; aoi < 5; aoi++) {
        float hr = aodet + aodet * float(aoi * aoi);
        vec3 aopos = nor * hr + pos;
        float dd = map(aopos);
        totao += -(dd - hr) * sca;
        sca *= 0.75;
    }
    return clamp(1.0 - 5.0 * totao, 0.0, 1.0);
}


vec3 lighting( in vec3 pos, in vec3 nor, in vec3 dir, in float dis)
{

    float ti = time ;//* 0.3;
     ;
    vec3 lightdir  = vec3(sin(ti), cos(ti * .5), - .7);


 	vec3 n = normal(pos);
    
	float sh = min(5., shadow(pos, lightdir));

    float ao = calcAO(pos, n);

    float diff = max(0., dot(lightdir, -n)) * sh * 1.3;
    float amb = max(0.2, dot(dir, -n)) * .4;
    vec3 r = reflect(lightdir, n);
    
    float spec = pow(max(0., dot(dir, -r)) * sh, 10.) * (.5 + ao * .5);
    float k = 1.0;
    vec3 col = mix(vec3(k * 1.1, k * k * 1.3, k * k * k), vec3(k), .45) * 2.;
    col = col * ao * (amb * vec3(.9, .85, 1.) + diff * vec3(1., .9, .9)) + spec * vec3(1, .9, .5) * .7;
    return col;

} 


mat3 lookAtMatrix( in vec3 ro, in vec3 ta, in float roll )
{
    vec3 ww = normalize( ta - ro );
    vec3 uu = normalize( cross(ww,vec3(sin(roll),cos(roll),0.0) ) );
    vec3 vv = normalize( cross(uu,ww));
    return mat3( uu, vv, ww );
}

float raymarch( in vec3 ro, in vec3 rd )
{
	const float maxd = 20.0;           
	const float precis = 0.001;        
   	 float h = precis*2.0;
    	float t = 0.0;
	float res = -1.0;
    	for( int i=0; i<64; i++ ){
        if( h<precis||t>maxd ) break;
	    h = map( ro+rd*t );
        t += h;
    }
    if( t<maxd ) res = t;
    return res;
}

void main( void ) {
	
	vec2 p = (-resolution.xy + 2.0*gl_FragCoord.xy)/resolution.y;
	vec2 s = p* vec2(1.75, 1.0);
	
	float t = mod(time*2.,20.);
	
	vec3 ro, ta;
    
	ro = vec3(2.772,0.424,0.820);
	ta = vec3(0.);
	
    
	mat3 camMat = lookAtMatrix( ro, ta, 0.0 );  
	
	vec3 rd = normalize( camMat * vec3(p.xy,1.5 + .80) ); 

	vec3 bg = vec3(0.);
	
	vec3 color = vec3(0.);
	
	float d = raymarch( ro, rd );
    	if( d>-0.1 )
    	{
        	vec3 pos = ro + d*rd;
        	vec3 nor = normal(pos);
        
        	color = lighting( pos, nor, rd, d );
     
	}
	
	
	 //color*=smoothstep(0.,2.,t);
  	 //color*=1.-smoothstep(198.,200.,t);
	

	gl_FragColor = vec4( color, 1.0 );

}