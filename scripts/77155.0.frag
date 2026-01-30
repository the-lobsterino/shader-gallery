#extension GL_OES_standard_derivatives : enable

precision highp float;
//merry_chrismaslol
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

mat2 rot(float a){
	return mat2(cos(a),-sin(a),sin(a),cos(a));
}

vec2 map(vec3 p){
	vec2 d2 = vec2(p.y,2.0);
	p.y -= 0.75*pow(dot(p.xz,p.xz),.62);
	vec2 d = vec2(length(p-vec3(0.,.1,0.))-.2,1.0);
	
	//return d2;
	return d.x<d2.x?d:d2;
}

float hash(float n){
	return fract(sin(n*156.54)*456.468);
}

float noise(vec3 x){
	vec3 p = floor(x);
	vec3 f = fract(x);
	
	f = f*f*3.-2.*f*f*f;
	float n = p.x+p.y*57.0+p.z*113.0;
	float res = mix(mix(mix( hash(n+  0.0), hash(n+  1.0),f.x),
                        mix( hash(n+ 57.0), hash(n+ 58.0),f.x),f.y),
                    mix(mix( hash(n+113.0), hash(n+114.0),f.x),
                        mix( hash(n+170.0), hash(n+171.0),f.x),f.y),f.z);
    return res;
}

float fbm(vec3 p){
	float f = 0.;
	f += 0.5000*noise( p ); p = p*2.02;
    	f += 0.2500*noise( p ); p = p*2.03;
    	f += 0.1250*noise( p ); p = p*2.01;
    	f += 0.0625*noise( p );

    return f/0.9375;
}

vec3 appleColor(vec3 pos,vec3 nor,vec2 spe){
	spe.x = 1.0;
	spe.y = 1.0;
	float a = cos(atan(pos.x,pos.z));
	float r = length(pos.xz);
	
	//red
	vec3 col = vec3(1.,0.,0.);
	
	//green
	float f = smoothstep(0.,1.,fbm(pos*10.));
	col = mix(col,vec3(.8,1.0,.2),f);
	
	return col;
}

vec2 rayMarch(vec3 ro,vec3 rd){
	float d = 0.;
	float lm = -1.0;
	float nh = 0.;
	float lh = 0.;
	float dt = 0.06;
	for(int i=0;i<100;i++){
		vec3 p = ro+rd*d;
		p.xz *= rot(time*0.2);
		vec2 ds = map(p);
		nh = ds.x;
		if(nh>0.){
			lh = nh;
			d+=dt;
		}
		lm = ds.y;
	}
	d = d - dt*nh/(nh-lh);
	return vec2(d,lm);
}


vec3 calcNormal(vec3 p){
	vec2 e = vec2(0.001,0.);
	vec3 n;
	n = map(p).x-vec3(map(p-e.xyy).x,map(p-e.yxy).x,map(p-e.yyx).x);
	
	return n;
}

void main( void ) {
	vec2 uv = ( gl_FragCoord.xy -.5* resolution.xy ) /resolution.y;
	
	vec3 col = vec3(1.);
	vec3 ro = vec3(0.,.4,-1.);
	vec3 lookat = vec3(0.,0.1,1.);
	float zoom = 1.5;
	vec3 f = normalize(lookat-ro);
	vec3 r = normalize(cross(vec3(0,1,0),f));
	vec3 u = cross(f,r);
	vec3 c = ro+f*zoom;
	vec3 i = c+uv.x*r+uv.y*u;
	vec3 rd = normalize(i-ro);
	
	vec2 d = rayMarch(ro,rd);
	vec3 lig = vec3(0.,1.,-1.);
	vec3 p = ro+rd*d.x;
	vec3 nor = normalize(calcNormal(p));
	float dif = dot(normalize(lig-p),nor);
	//d.x/=3.;
	vec2 pro;
	col *= dif;
	if(d.y<1.5)
		col *= appleColor(p,nor,pro);
	else 
		col *= vec3(0.3,0.4,0.5);
	gl_FragColor = vec4(col, 1.0 );

}