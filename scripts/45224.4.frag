#ifdef GL_ES
precision mediump float;
#endif

// in progress
// greets to my friend J.Branstrom

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float smin( float a, float b, float k )
{
    float h = clamp( 0.5+0.5*(b-a)/k, 0.0, 1.0 );
    return mix( b, a, h ) - k*h*(1.0-h);
}
float diffuse(vec3 n,vec3 l,float p) {
    return pow(dot(n,l) * 0.4 + 0.6,p);
}

float specular(vec3 n,vec3 l,vec3 e,float s) {    
    float nrm = (s + 8.0) / (3.1415 * 8.0);
    return pow(max(dot(reflect(e,n),l),0.0),s) * nrm;
}

vec3 getSkyColor(vec3 rd) {
	
    vec3 col = vec3(0.);
    
    float hort = 1. - clamp(abs(rd.y), 0., 1.);
    col += 0.5*vec3(.99,.5,.0)*exp2(hort*8.-8.);
    col += 0.1*vec3(.5,.9,1.)*exp2(hort*3.-3.);
    col += 0.55*vec3(.6,.6,.9);
    
    float sun = clamp( dot(vec3(0),rd), 0.0, 1.0 );
    col += .2*vec3(1.0,0.3,0.2)*pow( sun, 2.0 );
    col += .5*vec3(1.,.9,.9)*exp2(sun*650.-650.);
    col += .1*vec3(1.,1.,0.1)*exp2(sun*100.-100.);
    col += .3*vec3(1.,.7,0.)*exp2(sun*50.-50.);
    col += .5*vec3(1.,0.3,0.05)*exp2(sun*10.-10.); 
    
    float ax = atan(rd.y,length(rd.xz))/1.;
    float ay = atan(rd.z,rd.x)/2.;
    float st = 0.15;
    st = smoothstep(0.65,.9,st);
    col = mix(col,col+1.8*st,clamp(1.-1.1*length(col),0.,1.));

	return col;
}



vec3 getSeaColor(vec3 p, vec3 n, vec3 l, vec3 eye, vec3 dist) {  
    float fresnel = 1.0 - max(dot(n,-eye),0.0);
    fresnel = pow(fresnel,3.0) * 0.65;
        
    vec3 reflected = getSkyColor(reflect(eye,n));    
    vec3 refracted = vec3(0.1,0.19,0.22); + diffuse(n,l,80.0) * vec3(1.0) * 0.12; 
    
    vec3 color = mix(refracted,reflected,fresnel);
    
    float atten = max(1.0 - dot(dist,dist) * 0.001, 0.0);
    color += vec3(1.0) * (p.y - 0.5) * 0.18 * atten;
    
    color += vec3(specular(n,l,eye,60.0));
    
    return color;
}


float texture(vec3 p) {
	p=abs(.5-fract(p*10.));
	vec3 c=vec3(3.);
	float es, l=es=0.;
	for (int i = 0; i < 10; i++) { 
			p = abs(p + c) - abs(p - c) - p; 
			p/= clamp(dot(p, p), .0, 1.);
			p = p* -1.5 + c;
			if ( mod(float(i), 2.) < 1. ) { 
				float pl = l;
				l = length(p);
				es+= exp(-1. / abs(l - pl));
			}
	}
	return es;
}


vec2 de(vec3 p){
	float h = 0.;
	vec2 r = vec2(0);
	vec4 q = vec4(p, 1.0);
	q.xyz -= 1.5;
	q.y -= .3;
	float y=max(0.,0.2-abs(p.y))/.35;
	for(int i = 0; i < 2; i++) {
		q.xyz = abs(q.xyz + 1.0) - 1.0;
		q /= clamp(dot(q.xyz, q.xyz), 0.2, 1.0);
		
		q *= 1.7;
	}

	float fl=p.y + .35;
	
	float fr = min((length(q.xz) - 1.3)/q.w, min(p.y + 1.0, length(p.xz) - 0.6));
	
	float d = min(fl,fr);

	if (abs(d-fl)<.005) h=1.;
	
	return vec2(d,h);
	
}

vec2 map(vec3 p){
	return de(p);	
}


vec3 normal( in vec3 p) {
    vec2 e = vec2(1.0,-1.0)*0.5773*0.0005;
    return normalize(e.xyy * map(p + e.xyy).x + e.yyx * map(p + e.yyx).x + e.yxy * map(p + e.yxy).x + e.xxx * map(p + e.xxx).x);
}

vec2 raymarch(in vec3 from, in vec3 dir,float s) {
	
    float maxd = 30.0;
    float t = 0.0;
    float hid = 0.;
    for( int i=0; i<60; i++ )
    {
	float precis =  0.0005 * t;
	vec2 d = map( from+dir*t);
	float h = d.x;
	hid  = d.y;
	   
        if( h<precis||t>maxd ) break;
        t += h;
    }

   if( t>maxd ) t=-1.0;
    return vec2(t,hid);
}




float shadow( in vec3 ro, in vec3 rd){
	float res = .0;
    	float t = 0.5;
	float h;	
    	for (int i = 0; i < 12; i++)
	{
		h = map( ro + rd*t).x;
		res = min(6.0*h / t, res);
		t += h;
	}
    return max(res, 0.0);
}

float calcAO(vec3 p, vec3 n) {
	float o = 0.0, s = 0.005, w = 1.0;
	for(int i = 0; i < 15; i++) {
	float d = map(p + n*s).x;
		o += (s - d)*w;
		w *= 0.9;
		s += s/float(i + 1);
	}
	return 1.0 - clamp(o, 0.0, 1.0);	
}

vec3 lightdir=normalize(vec3(0.1,-0.3,-1.));

vec3 light(in vec3 ro, in vec3 rd,float t,float h) {

	vec3 col = vec3(1.0);
	
	vec3 pos = ro + rd*t;
	
	
	vec3 n = normal(pos);
	float sh =min(5., shadow(pos, lightdir));;
	
	float ao = calcAO(pos,n);
	
	float diff = max(0., dot(lightdir, -n)) * sh * 1.3;
	float amb = max(0.2, dot(rd, -n)) * .4;
	vec3 r = reflect(lightdir, n);
	float spec=pow(max(0.,dot(rd,-r))*sh,10.) * (.5 + ao * .5);
	
	if (t < 0.0005 ) { // bg
		float l=pow(max(0.,dot(normalize(rd),normalize(vec3(1.,0.,0.5)))),10.);
		col =vec3(.8,.85,1.)*.25*(2.-l)+vec3(1.,.9,.65)*l*.4;
		
	}else{	
		if(h > 0.5){
		//getSeaColor(vec3 p, vec3 n, vec3 l, vec3 eye, vec3 dist)
		 col   =   getSeaColor(pos,n,lightdir,rd,vec3(t));
			
		}else
		{
		float k=texture(pos)*.23+.2; 
		k=smin(k,1.5,.4);
		col = mix(vec3(k * 1.1, k * k * 1.3, k * k * k), vec3(k), .45) * 2.;
		col = col * ao * (amb * vec3(.9, .85, 1.) + diff * vec3(1., .9, .9)) + spec * vec3(1, .9, .5) * .7;
		}
	}
	
	
	
	
	return col;
		
	
	
		
}


vec3 scene(vec3 pos,vec3 dir){
	
	vec2 r = raymarch(pos,dir,time);
	vec3 color = light(pos - .0 * dir * 2.5, dir,r.x,r.y);
   	return color;
}


vec3 camPath(float time) {
   vec2 p =  vec2(cos(1.4 + 0.37 * time),cos(3.2 + 0.31 * time));
   return vec3(p.x, -0.2, p.y);
}


void main( void ) {
	
    vec2 uv = (gl_FragCoord.xy / resolution.xy) - .5;
    
    float t = time ;//* 0.1; 
	   //t = 200.;
    vec2 s = uv * vec2(1.75, 1.0);
	
    vec3 campos = camPath(t * .5);
    vec3 camtar = camPath(t + 1.);
	
    float roll = 0.4 * cos(0.4 * t);
	
    vec3 cw = normalize(camtar - campos);
	
    vec3 cp = vec3(sin(roll), cos(roll), 0.0);
	
    vec3 cu = normalize(cross(cw, cp));
    vec3 cv = normalize(cross(cu, cw));
    vec3 rd = normalize(s.x * cu + s.y * cv + .6 * cw);


	vec3 color = scene(campos,rd);
	
	gl_FragColor = vec4( color,1.);

}